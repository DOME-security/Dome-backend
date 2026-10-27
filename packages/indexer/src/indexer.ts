import type { EventPage, RegistryClient } from '@dome-security/registry-client';
import type { Store } from '@dome-security/server/store';

export const CURSOR_NAME = 'dome-registry';

export interface IndexerOptions {
  store: Store;
  registry: Pick<RegistryClient, 'events'>;
  /** First ledger to read when there is no saved cursor. Must be within the RPC retention window. */
  startLedger: number;
  pageSize?: number;
  pollIntervalMs?: number;
  signal?: AbortSignal;
  log?: (msg: string, extra?: Record<string, unknown>) => void;
}

/**
 * Reads one page of registry events and applies it, saving the cursor in the
 * same transaction. Returns how many events were applied.
 */
export async function indexOnce(options: IndexerOptions): Promise<{ applied: number; page: EventPage }> {
  const saved = await options.store.getCursor(CURSOR_NAME);
  const page = await options.registry.events(saved ? { cursor: saved } : { startLedger: options.startLedger }, options.pageSize ?? 200);
  if (page.cursor && page.cursor !== saved) {
    await options.store.applyEvents(page.events, { name: CURSOR_NAME, value: page.cursor });
  }
  return { applied: page.events.length, page };
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
