import type { Keypair, RegistryClient } from '@dome-security/registry-client';
import { reportHash } from './report-hash.js';
import type { Store } from './store/types.js';

export interface PublisherOptions {
  store: Store;
  registry: Pick<RegistryClient, 'attest'>;
  signer: Keypair;
  batchSize?: number;
  log?: (msg: string, extra?: Record<string, unknown>) => void;
}

/**
 * Publishes finished default-branch scans to the Dome Registry. Runs in the
 * API process, which holds the signing key; scan workers never see it.
 */
export async function publishPending({ store, registry, signer, batchSize = 10, log }: PublisherOptions): Promise<number> {
  let published = 0;
  for (const job of await store.pendingAttestations(batchSize)) {
    if (!job.report || !job.headSha || (job.verdict !== 'clean' && job.verdict !== 'review' && job.verdict !== 'block')) {
      await store.markAttested(job.id, { error: 'scan is not attestable' });
      continue;
    }
    try {
      const tx = await registry.attest(signer, {
        repo: `${job.owner}/${job.repo}`,
        commit: job.headSha,
        verdict: job.verdict,
        reportHash: reportHash(job.report),
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
