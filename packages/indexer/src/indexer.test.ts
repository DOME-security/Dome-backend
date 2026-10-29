import type { EventPage, OnChainAttestation, RegistryEvent } from '@dome-security/registry-client';
import { MemoryStore } from '@dome-security/server/store';
import { describe, expect, it } from 'vitest';
import { CURSOR_NAME, indexOnce, rebuildIndex, type IndexerOptions } from './indexer.js';

const meta = (n: number) => ({
  id: `${String(n).padStart(10, '0')}-0000000001`,
  ledger: n,
  txHash: String(n % 10).repeat(64),
  contractId: 'C',
  closedAt: '2026-10-27T00:00:00.000Z',
});
const hash = 'a'.repeat(64);
const repoId = 'b'.repeat(64);

const chain: RegistryEvent[] = [
  { ...meta(1), type: 'propose', hash, fileKind: 'font', campaign: 'demo', evidence: 'e'.repeat(64), curator: 'G1' },
  { ...meta(2), type: 'approve', hash, curator: 'G2', approvals: 2, status: 'active' },
  { ...meta(3), type: 'attest', repoId, verdict: 'clean', commit: 'c'.repeat(40), attester: 'GA', index: 0 },
  { ...meta(4), type: 'retract_attest', repoId, index: 0, by: 'GA', reason: 'f'.repeat(64) },
  { ...meta(5), type: 'attest', repoId, verdict: 'block', commit: 'd'.repeat(40), attester: 'GA', index: 1 },
];

const stored = (index: number, commit: string, verdict: OnChainAttestation['verdict']): OnChainAttestation => ({
  repoId,
  index,
  commit,
  verdict,
  scanner: 1000,
  rulesHash: '1'.repeat(64),
  reportHash: `${index}`.repeat(64),
  attester: 'GA',
  at: 0,
  retractedBy: null,
  retractReason: null,
});

/** A fake registry that serves `chain` in pages of `size`, with cursors like an RPC. */
function fakeRegistry(size: number, reads: { failing?: boolean } = {}): IndexerOptions['registry'] & { requests: string[] } {
  const requests: string[] = [];
  return {
    requests,
    async events(position): Promise<EventPage> {
      const start = 'cursor' in position ? Number(position.cursor) : 0;
      requests.push('cursor' in position ? `cursor:${position.cursor}` : `ledger:${position.startLedger}`);
      const events = chain.slice(start, start + size);
      return { events, cursor: String(start + events.length), latestLedger: 99 };
    },
    async readAttestation(_repoId, index) {
      if (reads.failing) throw new Error('rpc down');
      return index === 0 ? stored(0, 'c'.repeat(40), 'clean') : stored(1, 'd'.repeat(40), 'block');
    },
  };
}

async function drain(options: IndexerOptions): Promise<void> {
  for (let i = 0; i < 20; i++) if ((await indexOnce(options)).applied === 0) return;
}

describe('indexer', () => {
  it('indexes the indicator lifecycle and attestation history with stored hashes', async () => {
    const store = new MemoryStore();
    await drain({ store, registry: fakeRegistry(2), startLedger: 1 });
    expect(await store.getIndicator(hash)).toMatchObject({ status: 'active', fileKind: 'font', campaign: 'demo', approvals: 2 });
    expect((await store.listIndicators(null, 10)).items.map((i) => i.hash)).toEqual([hash]);
    expect(await store.latestAttestation(repoId)).toMatchObject({ index: 1, verdict: 'block', reportHash: '1'.repeat(64), retractedBy: null });
  });

  it('resumes from the saved cursor instead of the start ledger', async () => {
    const store = new MemoryStore();
    const registry = fakeRegistry(2);
    await indexOnce({ store, registry, startLedger: 7 });
    await indexOnce({ store, registry, startLedger: 7 });
    expect(registry.requests).toEqual(['ledger:7', 'cursor:2']);
    expect(await store.getCursor(CURSOR_NAME)).toBe('4');
  });

  it('is idempotent: replaying every event changes nothing', async () => {
    const store = new MemoryStore();
    await drain({ store, registry: fakeRegistry(5), startLedger: 1 });
    const before = [await store.getIndicator(hash), await store.latestAttestation(repoId)];
    const indexed = chain.map((e) => (e.type === 'attest' ? { ...e, stored: stored(e.index, e.commit, e.verdict) } : e));
    await store.applyEvents(indexed, { name: CURSOR_NAME, value: '5' });
    await store.applyEvents([...indexed].reverse(), { name: CURSOR_NAME, value: '5' });
    expect([await store.getIndicator(hash), await store.latestAttestation(repoId)]).toEqual(before);
  });

  it('keeps a retracted indicator retracted', async () => {
    const store = new MemoryStore();
    await store.applyEvents(chain.slice(0, 2), { name: CURSOR_NAME, value: '2' });
    await store.applyEvents([{ ...meta(9), type: 'retract', hash, curator: 'G2', reason: 'f'.repeat(64) }], { name: CURSOR_NAME, value: '3' });
    await store.applyEvents([{ ...meta(10), type: 'approve', hash, curator: 'G3', approvals: 3, status: 'active' }], { name: CURSOR_NAME, value: '4' });
    expect(await store.getIndicator(hash)).toMatchObject({ status: 'retracted', retractReason: 'f'.repeat(64) });
    expect((await store.listIndicators(null, 10)).items).toEqual([]);
  });

  it('still indexes attestations when the stored record cannot be read', async () => {
    const store = new MemoryStore();
    await drain({ store, registry: fakeRegistry(5, { failing: true }), startLedger: 1 });
    expect(await store.latestAttestation(repoId)).toMatchObject({ index: 1, reportHash: null });
  });

  it('rebuilds from scratch to the same index', async () => {
    const store = new MemoryStore();
    await drain({ store, registry: fakeRegistry(2), startLedger: 1 });
    const before = [await store.getIndicator(hash), await store.latestAttestation(repoId)];
    await rebuildIndex(store);
    expect(await store.getCursor(CURSOR_NAME)).toBeUndefined();
    expect(await store.getIndicator(hash)).toBeUndefined();
    const registry = fakeRegistry(3);
    await drain({ store, registry, startLedger: 1 });
    expect(registry.requests[0]).toBe('ledger:1');
    expect([await store.getIndicator(hash), await store.latestAttestation(repoId)]).toEqual(before);
  });
});
