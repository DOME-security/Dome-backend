import type { EventPage, RegistryEvent } from '@dome-security/registry-client';
import { MemoryStore } from '@dome-security/server/store';
import { describe, expect, it } from 'vitest';
import { CURSOR_NAME, indexOnce } from './indexer.js';

const ev = (id: string, e: Partial<RegistryEvent> & Pick<RegistryEvent, 'type'>): RegistryEvent =>
  ({ id, ledger: Number(id), txHash: 't', contractId: 'C', closedAt: '2026-10-27T00:00:00.000Z', ...e }) as RegistryEvent;

function fakeRegistry(pages: EventPage[]) {
  const requests: unknown[] = [];
  return {
    requests,
    events: async (position: unknown) => {
      requests.push(position);
      return pages.shift() ?? { events: [], cursor: undefined, latestLedger: 0 };
    },
  };
}

describe('indexer', () => {
  it('starts at the configured ledger, then follows the saved cursor', async () => {
    const store = new MemoryStore();
    const registry = fakeRegistry([
      {
        events: [
          ev('1', { type: 'approve', kind: 'package', value: 'dome-fixture-evil', campaign: 'T', evidence: [] }),
          ev('2', { type: 'attest', repo: 'o/r', commit: 'a'.repeat(40), verdict: 'block', reportHash: 'b'.repeat(64), attester: 'G' }),
        ],
        cursor: 'c1',
        latestLedger: 10,
      },
      { events: [ev('3', { type: 'revoke', kind: 'package', value: 'dome-fixture-evil' })], cursor: 'c2', latestLedger: 11 },
    ]);
    const options = { store, registry, startLedger: 1000 };

    expect((await indexOnce(options)).applied).toBe(2);
    expect(await store.getCursor(CURSOR_NAME)).toBe('c1');
    expect((await store.getIndicator('package', 'dome-fixture-evil'))?.active).toBe(true);
    expect((await store.latestAttestation('o', 'r'))?.verdict).toBe('block');

    await indexOnce(options);
    expect(registry.requests).toEqual([{ startLedger: 1000 }, { cursor: 'c1' }]);
    expect((await store.getIndicator('package', 'dome-fixture-evil'))?.active).toBe(false);
    expect(await store.getCursor(CURSOR_NAME)).toBe('c2');
  });

  it('does not move the cursor when nothing new arrived', async () => {
    const store = new MemoryStore();
    await indexOnce({ store, registry: fakeRegistry([{ events: [], cursor: undefined, latestLedger: 5 }]), startLedger: 1 });
    expect(await store.getCursor(CURSOR_NAME)).toBeUndefined();
  });
});
