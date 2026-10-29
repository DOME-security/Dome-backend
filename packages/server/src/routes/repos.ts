import { repoIdOf } from '@dome-security/registry-client';
import type { FastifyInstance } from 'fastify';
import { errorSchema, repoSummarySchema } from '../schemas.js';
import type { AttestationRecord, Store } from '../store/types.js';
import { presentScan } from './scans.js';

export function repoRoutes(app: FastifyInstance, store: Store): void {
  app.get<{ Params: { owner: string; repo: string } }>(
    '/v1/repos/:owner/:repo',
    {
      schema: {
        summary: "A repository's latest scan and on-chain attestation",
        tags: ['repos'],
        params: {
          type: 'object',
          required: ['owner', 'repo'],
          properties: {
            owner: { type: 'string', pattern: '^[A-Za-z0-9-]{1,39}$' },
            repo: { type: 'string', pattern: '^(?!\\.\\.?$)[A-Za-z0-9._-]{1,100}$' },
          },
        },
        response: { 200: repoSummarySchema, 400: errorSchema },
      },
    },
    async (req) => {
      const { owner, repo } = req.params;
      const [scan, attestation] = await Promise.all([store.latestScan(owner, repo), store.latestAttestation(repoIdOf(owner, repo))]);
      return {
        repository: { owner, repo },
        latestScan: scan ? presentScan(scan) : null,
        attestation: attestation ? presentAttestation(attestation) : null,
      };
    },
  );
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
