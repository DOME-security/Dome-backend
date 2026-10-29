import { repoIdOf } from '@dome-security/registry-client';
import type { FastifyInstance } from 'fastify';
import type { AttestationRecord, Store } from '../store/types.js';
import { presentScan } from './scans.js';

const OWNER = /^[A-Za-z0-9-]{1,39}$/;
const REPO = /^[A-Za-z0-9._-]{1,100}$/;

export function repoRoutes(app: FastifyInstance, store: Store): void {
  app.get<{ Params: { owner: string; repo: string } }>('/v1/repos/:owner/:repo', async (req, reply) => {
    const { owner, repo } = req.params;
    if (!OWNER.test(owner) || !REPO.test(repo)) return reply.code(400).send({ error: 'invalid repository name' });
    const [scan, attestation] = await Promise.all([store.latestScan(owner, repo), store.latestAttestation(repoIdOf(owner, repo))]);
    return { repository: { owner, repo }, latestScan: scan ? presentScan(scan) : null, attestation: attestation ? presentAttestation(attestation) : null };
  });
}

/** The newest on-chain attestation for a repository. A retracted one is still shown, marked retracted. */
export function presentAttestation(a: AttestationRecord) {
  return {
    index: a.index,
    commit: a.commit,
    verdict: a.verdict,
    reportHash: a.reportHash,
    rulesHash: a.rulesHash,
    scanner: a.scanner,
    attester: a.attester,
    ledger: a.ledger,
    txHash: a.txHash,
    closedAt: a.closedAt,
    retracted: a.retractedBy !== null,
    retractedBy: a.retractedBy,
    retractReason: a.retractReason,
  };
}
