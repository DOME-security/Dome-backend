import type { EventPage, OnChainAttestation, RegistryClient, RegistryEvent } from '@dome-security/registry-client';
import type { IndexedEvent, Store } from '@dome-security/server/store';

export const CURSOR_NAME = 'dome-registry';

export interface IndexerOptions {
  store: Store;
  registry: Pick<RegistryClient, 'events' | 'readAttestation'>;
  /** First ledger to read when there is no saved cursor. Must be within the RPC retention window. */
  startLedger: number;
  pageSize?: number;
  pollIntervalMs?: number;
  signal?: AbortSignal;
  log?: (msg: string, extra?: Record<string, unknown>) => void;
}

/**
 * Events carry only part of an attestation. Reads the stored record for the
 * report and rule-set hashes; if that read fails the event is still indexed
 * and the hashes stay empty rather than holding up the index.
 */
async function withStored(options: IndexerOptions, e: RegistryEvent): Promise<IndexedEvent> {
  if (e.type !== 'attest') return e;
  let stored: OnChainAttestation | undefined;
  try {
    stored = await options.registry.readAttestation(e.repoId, e.index);
  } catch (error) {
    options.log?.('could not read attestation', { repoId: e.repoId, index: e.index, error: (error as Error).message });
  }
  // The stored entry must be the one the event announced.
  return stored && stored.commit === e.commit && stored.verdict === e.verdict ? { ...e, stored } : e;
}

/**
 * Reads one page of registry events and applies it, saving the cursor in the
 * same transaction, so a restart resumes after the last applied page.
 * Returns how many events were applied.
 */
export async function indexOnce(options: IndexerOptions): Promise<{ applied: number; page: EventPage }> {
  const saved = await options.store.getCursor(CURSOR_NAME);
  const page = await options.registry.events(saved ? { cursor: saved } : { startLedger: options.startLedger }, options.pageSize ?? 200);
  if (page.cursor && page.cursor !== saved) {
    const events: IndexedEvent[] = [];
    for (const e of page.events) events.push(await withStored(options, e));
    await options.store.applyEvents(events, { name: CURSOR_NAME, value: page.cursor });
  }
  return { applied: page.events.length, page };
}

/**
 * Deletes the indexed registry data and the saved cursor. The next run
 * re-reads every event from `startLedger`; the chain is the source of truth.
 */
export async function rebuildIndex(store: Pick<Store, 'resetIndex'>): Promise<void> {
  await store.resetIndex(CURSOR_NAME);
}

/**
 * Follows the registry until the signal aborts. The chain is the source of
 * truth: deleting the cursor and the indexed tables rebuilds them from events.
 */
export async function runIndexer(options: IndexerOptions): Promise<void> {
  const poll = options.pollIntervalMs ?? 5000;
  let backoff = poll;
  while (!options.signal?.aborted) {
    try {
      const { applied, page } = await indexOnce(options);
      if (applied > 0) options.log?.('indexed events', { applied, latestLedger: page.latestLedger });
      backoff = poll;
      if (applied >= (options.pageSize ?? 200)) continue;
    } catch (error) {
      options.log?.('indexer error', { error: (error as Error).message });
      backoff = Math.min(backoff * 2, 60_000);
    }
    await new Promise((r) => setTimeout(r, backoff));
  }
}
