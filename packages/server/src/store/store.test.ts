import { randomUUID } from 'node:crypto';
import type { ScanResult } from '@dome-security/engine';
import pg from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { MemoryStore } from './memory.js';
import { migrate } from './migrate.js';
import { PgStore } from './pg.js';
import type { Store } from './types.js';

const result = (verdict: ScanResult['verdict']): ScanResult => ({
  tool: { name: 'dome', version: '0.1.0' },
  target: 't',
  scope: 'full',
  verdict,
  findings: [],
  incomplete: [],
  stats: { filesInTree: 1, filesInScope: 1, rulesRun: 1 },
});

const meta = (id: string) => ({ id, ledger: 1, txHash: 'aa', contractId: 'C', closedAt: '2026-10-27T00:00:00.000Z' });

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

    it('never queues an attestation for an incomplete scan', async () => {
      const { job } = await store.enqueueScan({ repoUrl: 'https://github.com/o/r', owner: 'o', repo: 'r', source: 'api' });
      await store.claimScan('w', 60_000, 3);
      await store.completeScan(job.id, result('incomplete'), { attestable: true });
      expect((await store.getScan(job.id))?.attestStatus).toBe('none');
    });

    it('records failures', async () => {
      const { job } = await store.enqueueScan({ repoUrl: 'https://github.com/o/r', owner: 'o', repo: 'r', source: 'api' });
      await store.failScan(job.id, 'clone failed');
      expect(await store.getScan(job.id)).toMatchObject({ status: 'failed', error: 'clone failed' });
    });

    it('applies registry events idempotently and in order', async () => {
      await store.applyEvents(
        [
          { ...meta('0002'), type: 'approve', kind: 'hash', value: 'b'.repeat(64), campaign: 'C', evidence: ['https://x.invalid'] },
          { ...meta('0001'), type: 'revoke', kind: 'hash', value: 'b'.repeat(64) },
          { ...meta('0003'), type: 'approve', kind: 'package', value: 'evil', campaign: 'C', evidence: [] },
          {
            ...meta('0004'),
            type: 'attest',
            repo: 'o/r',
            commit: 'c'.repeat(40),
            verdict: 'clean',
            reportHash: 'd'.repeat(64),
            attester: 'G',
          },
        ],
        { name: 'registry', value: 'cur-1' },
      );
      expect((await store.getIndicator('hash', 'b'.repeat(64)))?.active).toBe(true);
      expect(await store.getCursor('registry')).toBe('cur-1');
      expect((await store.latestAttestation('o', 'r'))?.commit).toBe('c'.repeat(40));

      await store.applyEvents([{ ...meta('0005'), type: 'revoke', kind: 'hash', value: 'b'.repeat(64) }], { name: 'registry', value: 'cur-2' });
      expect((await store.getIndicator('hash', 'b'.repeat(64)))?.active).toBe(false);
      const page = await store.listIndicators(null, 10);
      expect(page.items.map((i) => i.value)).toEqual(['evil']);
    });

    it('pages indicators with a cursor', async () => {
      const events = ['a1', 'a2', 'a3'].map((v, i) => ({
        ...meta(`00${i}`),
        type: 'approve' as const,
        kind: 'package' as const,
        value: v,
        campaign: 'C',
        evidence: [],
      }));
      await store.applyEvents(events, { name: 'registry', value: 'c' });
      const first = await store.listIndicators(null, 2);
      expect(first.items.map((i) => i.value)).toEqual(['a1', 'a2']);
      const second = await store.listIndicators(first.nextCursor, 2);
      expect(second.items.map((i) => i.value)).toEqual(['a3']);
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
