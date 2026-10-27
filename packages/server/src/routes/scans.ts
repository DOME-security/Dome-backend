import type { FastifyInstance } from 'fastify';
import { parseRepoUrl } from '../github.js';
import { reportHash } from '../report-hash.js';
import type { ScanJob, Store } from '../store/types.js';

const REF = /^(?!-)(?!.*\.\.)[A-Za-z0-9._/-]{1,200}$/;

export function presentScan(job: ScanJob) {
  return {
    id: job.id,
    repository: { owner: job.owner, repo: job.repo, url: job.repoUrl },
    ref: job.ref,
    commit: job.headSha,
    pullRequest: job.pullRequest,
    status: job.status,
    verdict: job.verdict,
    createdAt: job.createdAt,
    startedAt: job.startedAt,
    finishedAt: job.finishedAt,
    ...(job.status === 'failed' ? { error: job.error } : {}),
    ...(job.report ? { report: job.report, reportHash: reportHash(job.report) } : {}),
    attestation: job.attestStatus === 'published' ? { tx: job.attestTx } : null,
  };
}

export function scanRoutes(app: FastifyInstance, store: Store, rateLimitPerMinute: number): void {
  app.post<{ Body: { url?: unknown; ref?: unknown } }>(
    '/v1/scans',
    {
      config: { rateLimit: { max: rateLimitPerMinute, timeWindow: '1 minute' } },
      schema: {
        body: {
          type: 'object',
          required: ['url'],
          additionalProperties: false,
          properties: { url: { type: 'string', maxLength: 300 }, ref: { type: 'string', maxLength: 200 } },
        },
      },
    },
    async (req, reply) => {
      const parsed = parseRepoUrl(String(req.body.url));
      if (!parsed) return reply.code(400).send({ error: 'url must be a public https://github.com/<owner>/<repo> URL' });
      const ref = req.body.ref === undefined ? null : String(req.body.ref);
      if (ref !== null && !REF.test(ref)) return reply.code(400).send({ error: 'ref is not a valid branch or tag name' });
      const { job, created } = await store.enqueueScan({ ...parsed, ref, source: 'api' });
      return reply
        .code(created ? 202 : 200)
        .header('location', `/v1/scans/${job.id}`)
        .send({ id: job.id, status: job.status, links: { self: `/v1/scans/${job.id}` } });
    },
  );

  app.get<{ Params: { id: string } }>('/v1/scans/:id', async (req, reply) => {
    const job = await store.getScan(req.params.id);
    if (!job) return reply.code(404).send({ error: 'scan not found' });
    return presentScan(job);
  });
}
