import type { Verdict } from '@dome-security/engine';
import { scannerVersion, type Keypair, type RegistryClient, type RegistryVerdict } from '@dome-security/registry-client';
import { reportHash } from './report-hash.js';
import type { Store } from './store/types.js';

/**
 * How long a `block` result waits before it is published. The Dome Registry
 * publication policy (dome-contracts docs/publication-policy.md, rule 2)
 * gives the maintainers of a repository time to be told privately and
 * respond before a block is written on chain. Telling them is a human step.
 */
export const DEFAULT_BLOCK_HOLD_MS = 72 * 60 * 60 * 1000;

export interface PublisherOptions {
  store: Store;
  registry: Pick<RegistryClient, 'attest'>;
  signer: Keypair;
  batchSize?: number;
  blockHoldMs?: number;
  log?: (msg: string, extra?: Record<string, unknown>) => void;
}

const ON_CHAIN: Record<Verdict, RegistryVerdict> = { clean: 'clean', review: 'review', block: 'block', incomplete: 'unreadable' };
const SHA1 = /^[0-9a-f]{40}$/;

/**
 * Publishes finished default-branch scans to the Dome Registry. Runs in the
 * API process, which holds the signing key; scan workers never see it.
 */
export async function publishPending({
  store,
  registry,
  signer,
  batchSize = 10,
  blockHoldMs = DEFAULT_BLOCK_HOLD_MS,
  log,
}: PublisherOptions): Promise<number> {
  let published = 0;
  for (const job of await store.pendingAttestations(batchSize, { blockHoldMs })) {
    const report = job.report;
    if (!report || !job.headSha || !SHA1.test(job.headSha) || !job.verdict || !report.tool.rulesHash) {
      await store.markAttested(job.id, { error: 'scan is not attestable' });
      continue;
    }
    try {
      const tx = await registry.attest(signer, {
        owner: job.owner,
        repo: job.repo,
        commit: job.headSha,
        verdict: ON_CHAIN[job.verdict],
        scanner: scannerVersion(report.tool.version),
        rulesHash: report.tool.rulesHash,
        reportHash: reportHash(report),
      });
      await store.markAttested(job.id, { tx });
      published++;
    } catch (error) {
      log?.('attestation failed', { scan: job.id, error: (error as Error).message });
      await store.markAttested(job.id, { error: 'attestation failed' });
    }
  }
  return published;
}
