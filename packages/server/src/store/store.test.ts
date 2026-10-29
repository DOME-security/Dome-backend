import { randomUUID } from 'node:crypto';
import type { ScanResult } from '@dome-security/engine';
import pg from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { MemoryStore } from './memory.js';
import { migrate } from './migrate.js';
import { PgStore } from './pg.js';
import type { Store } from './types.js';

const result = (verdict: ScanResult['verdict']): ScanResult => ({
  tool: { name: 'dome', version: '0.1.0', rulesHash: 'f'.repeat(64) },
  target: 't',
  scope: 'full',
  verdict,
  findings: [],
  incomplete: [],
  stats: { filesInTree: 1, filesInScope: 1, rulesRun: 1 },
});

const meta = (id: string) => ({ id, ledger: 1, txHash: 'a'.repeat(64), contractId: 'C', closedAt: '2026-10-27T00:00:00.000Z' });
const hash = (c: string) => c.repeat(64);
const repoId = '9'.repeat(64);

function contract(name: string, make: () => Promise<Store>) {
  describe(`${name} store`, () => {
    let store: Store;
    beforeEach(async () => {
      store = await make();
    });

    it('queues scans and deduplicates identical pending ones', async () => {
      const input = { repoUrl: 'https://github.com/o/r', owner: 'o', repo: 'r', headSha: 'a'.repeat(40), source: 'api' as const };
      const first = await store.enqueueScan(input);
      const second = await store.enqueueScan(input);
      expect(first.created).toBe(true);
      expect(second.created).toBe(false);
      expect(second.job.id).toBe(first.job.id);
      expect((await store.getScan(first.job.id))?.status).toBe('queued');
      expect(await store.getScan(randomUUID())).toBeUndefined();
    });

    it('claims, completes and marks attestable scans pending', async () => {
      const { job } = await store.enqueueScan({ repoUrl: 'https://github.com/o/r', owner: 'o', repo: 'r', source: 'api' });
      const claimed = await store.claimScan('w1', 60_000, 3);
      expect(claimed?.id).toBe(job.id);
      expect(claimed?.status).toBe('running');
      expect(await store.claimScan('w2', 60_000, 3)).toBeUndefined();
      await store.completeScan(job.id, result('review'), { attestable: true, headSha: 'e'.repeat(40) });
      const done = await store.getScan(job.id);
      expect(done).toMatchObject({ status: 'done', verdict: 'review', attestStatus: 'pending', headSha: 'e'.repeat(40) });
      expect(done?.report?.verdict).toBe('review');
      expect((await store.pendingAttestations(10)).map((s) => s.id)).toEqual([job.id]);
      await store.markAttested(job.id, { tx: 'abc' });
      expect(await store.pendingAttestations(10)).toEqual([]);
      expect((await store.latestScan('o', 'r'))?.attestTx).toBe('abc');
    });

    it('queues an incomplete scan for attestation (published as unreadable)', async () => {
      const { job } = await store.enqueueScan({ repoUrl: 'https://github.com/o/r', owner: 'o', repo: 'r', source: 'api' });
      await store.claimScan('w', 60_000, 3);
      await store.completeScan(job.id, result('incomplete'), { attestable: true });
      expect((await store.getScan(job.id))?.attestStatus).toBe('pending');
    });

    it('holds block results back from publishing for the hold period', async () => {
      const { job } = await store.enqueueScan({ repoUrl: 'https://github.com/o/b', owner: 'o', repo: 'b', source: 'api' });
      await store.claimScan('w', 60_000, 3);
      await store.completeScan(job.id, result('block'), { attestable: true, headSha: 'e'.repeat(40) });
      expect(await store.pendingAttestations(10, { blockHoldMs: 60 * 60 * 1000 })).toEqual([]);
      expect((await store.pendingAttestations(10, { blockHoldMs: 0 })).map((j) => j.id)).toEqual([job.id]);
    });

    it('records failures', async () => {
      const { job } = await store.enqueueScan({ repoUrl: 'https://github.com/o/r', owner: 'o', repo: 'r', source: 'api' });
      await store.failScan(job.id, 'clone failed');
      expect(await store.getScan(job.id)).toMatchObject({ status: 'failed', error: 'clone failed' });
    });

    it('applies registry events idempotently and in order', async () => {
      const events = [
        { ...meta('0001'), type: 'propose' as const, hash: hash('b'), fileKind: 'font' as const, campaign: 'demo', evidence: hash('e'), curator: 'G1' },
        { ...meta('0002'), type: 'approve' as const, hash: hash('b'), curator: 'G2', approvals: 2, status: 'active' as const },
        { ...meta('0003'), type: 'approve' as const, hash: hash('c'), curator: 'G2', approvals: 1, status: 'proposed' as const },
        {
          ...meta('0004'),
          type: 'attest' as const,
          repoId,
          commit: 'c'.repeat(40),
          verdict: 'clean' as const,
          attester: 'GA',
          index: 0,
          stored: {
            repoId,
            index: 0,
            commit: 'c'.repeat(40),
            verdict: 'clean' as const,
            scanner: 1000,
            rulesHash: hash('1'),
            reportHash: hash('d'),
            attester: 'GA',
            at: 0,
            retractedBy: null,
            retractReason: null,
          },
        },
      ];
      await store.applyEvents(events, { name: 'registry', value: 'cur-1' });
      await store.applyEvents(events, { name: 'registry', value: 'cur-1' });
      expect(await store.getIndicator(hash('b'))).toMatchObject({ status: 'active', fileKind: 'font', campaign: 'demo', evidence: hash('e'), approvals: 2 });
      expect(await store.getIndicator(hash('c'))).toMatchObject({ status: 'proposed', fileKind: null, campaign: null });
      expect(await store.getCursor('registry')).toBe('cur-1');
      expect(await store.latestAttestation(repoId)).toMatchObject({ commit: 'c'.repeat(40), reportHash: hash('d'), scanner: 1000, retractedBy: null });
      expect((await store.listIndicators(null, 10)).items.map((i) => i.hash)).toEqual([hash('b')]);

      await store.applyEvents(
        [
          { ...meta('0005'), type: 'retract', hash: hash('b'), curator: 'G1', reason: hash('f') },
          { ...meta('0006'), type: 'retract_attest', repoId, index: 0, by: 'GA', reason: hash('f') },
        ],
        { name: 'registry', value: 'cur-2' },
      );
      // An older approval replayed after the retraction changes nothing.
      await store.applyEvents([events[1]!], { name: 'registry', value: 'cur-2' });
      expect(await store.getIndicator(hash('b'))).toMatchObject({ status: 'retracted', retractReason: hash('f') });
      expect(await store.latestAttestation(repoId)).toMatchObject({ retractedBy: 'GA', retractReason: hash('f') });
      expect((await store.listIndicators(null, 10)).items).toEqual([]);

      await store.resetIndex('registry');
      expect(await store.getIndicator(hash('b'))).toBeUndefined();
      expect(await store.latestAttestation(repoId)).toBeUndefined();
      expect(await store.getCursor('registry')).toBeUndefined();
    });

    it('pages active indicators with a cursor', async () => {
      const events = ['1', '2', '3'].map((c, i) => ({
        ...meta(`000${i}`),
        type: 'approve' as const,
        hash: hash(c),
        curator: 'G',
        approvals: 2,
        status: 'active' as const,
      }));
      await store.applyEvents(events, { name: 'registry', value: 'c' });
      const first = await store.listIndicators(null, 2);
      expect(first.items.map((i) => i.hash)).toEqual([hash('1'), hash('2')]);
      const second = await store.listIndicators(first.nextCursor, 2);
      expect(second.items.map((i) => i.hash)).toEqual([hash('3')]);
      expect(second.nextCursor).toBeNull();
    });
  });
}

contract('memory', async () => new MemoryStore());

const databaseUrl = process.env.DATABASE_URL;
describe.runIf(Boolean(databaseUrl))('postgres', () => {
  const schema = `test_${randomUUID().replace(/-/g, '')}`;
  let admin: pg.Pool;
  let pool: pg.Pool;

  beforeAll(async () => {
    admin = new pg.Pool({ connectionString: databaseUrl });
    await admin.query(`CREATE SCHEMA ${schema}`);
    pool = new pg.Pool({ connectionString: databaseUrl, options: `-c search_path=${schema}` });
    await migrate(pool);
    expect(await migrate(pool)).toEqual([]);
  });

  afterAll(async () => {
    await pool?.end();
    await admin?.query(`DROP SCHEMA ${schema} CASCADE`);
    await admin?.end();
  });

  contract('pg', async () => {
    await pool.query('TRUNCATE scans, indicators, attestations, indexer_cursors');
    return new PgStore(pool);
  });
});
