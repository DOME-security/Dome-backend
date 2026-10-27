import type { FastifyInstance } from 'fastify';
import type { Store } from '../store/types.js';
import { presentScan } from './scans.js';

const OWNER = /^[A-Za-z0-9-]{1,39}$/;
const REPO = /^[A-Za-z0-9._-]{1,100}$/;

export function repoRoutes(app: FastifyInstance, store: Store): void {
  app.get<{ Params: { owner: string; repo: string } }>('/v1/repos/:owner/:repo', async (req, reply) => {
    const { owner, repo } = req.params;
    if (!OWNER.test(owner) || !REPO.test(repo)) return reply.code(400).send({ error: 'invalid repository name' });
    const [scan, attestation] = await Promise.all([store.latestScan(owner, repo), store.latestAttestation(owner, repo)]);
    return { repository: { owner, repo }, latestScan: scan ? presentScan(scan) : null, attestation: attestation ?? null };
  });
}
