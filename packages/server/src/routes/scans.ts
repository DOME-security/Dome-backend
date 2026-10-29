import type { FastifyInstance } from 'fastify';
import { parseRepoUrl } from '../github.js';
import { reportHash } from '../report-hash.js';
import { createdScanSchema, errorSchema, scanSchema } from '../schemas.js';
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
  app.post<{ Body: { url: string; ref?: string } }>(
    '/v1/scans',
    {
      config: { rateLimit: { max: rateLimitPerMinute, timeWindow: '1 minute' } },
      schema: {
        summary: 'Queue a scan of a public GitHub repository',
        description: 'Scans the default branch (or `ref`). Returns 200 with the existing scan when an identical one is already queued or running.',
        tags: ['scans'],
        body: {
          type: 'object',
          required: ['url'],
          additionalProperties: false,
          properties: {
            url: { type: 'string', maxLength: 300, description: 'https://github.com/<owner>/<repo>' },
            ref: { type: 'string', maxLength: 200, description: 'Branch or tag name' },
          },
        },
        response: { 200: createdScanSchema, 202: createdScanSchema, 400: errorSchema, 429: errorSchema },
      },
    },
    async (req, reply) => {
      const parsed = parseRepoUrl(req.body.url);
      if (!parsed) return reply.code(400).send({ error: 'url must be a public https://github.com/<owner>/<repo> URL' });
      const ref = req.body.ref ?? null;
      if (ref !== null && !REF.test(ref)) return reply.code(400).send({ error: 'ref is not a valid branch or tag name' });
      const { job, created } = await store.enqueueScan({ ...parsed, ref, source: 'api' });
      return reply
        .code(created ? 202 : 200)
        .header('location', `/v1/scans/${job.id}`)
        .send({ id: job.id, status: job.status, links: { self: `/v1/scans/${job.id}` } });
    },
  );

  app.get<{ Params: { id: string } }>(
    '/v1/scans/:id',
    {
      schema: {
        summary: 'Get a scan and, once done, its report',
        tags: ['scans'],
        params: { type: 'object', required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
        response: { 200: scanSchema, 400: errorSchema, 404: errorSchema },
      },
    },
    async (req, reply) => {
      const job = await store.getScan(req.params.id.toLowerCase());
      if (!job) return reply.code(404).send({ error: 'scan not found' });
      return presentScan(job);
    },
  );
}
