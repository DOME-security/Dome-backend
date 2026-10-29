import type { FastifyInstance } from 'fastify';
import { errorSchema, indicatorLookupSchema, indicatorPageSchema } from '../schemas.js';
import { toIntelIndicator, type Store } from '../store/types.js';

export function indicatorRoutes(app: FastifyInstance, store: Store): void {
  app.get<{ Params: { sha256: string } }>(
    '/v1/indicators/:sha256',
    {
      schema: {
        summary: 'Is this file hash a known-bad indicator?',
        description: 'Hash the file locally (SHA-256) and look the digest up; the file itself is never uploaded.',
        tags: ['indicators'],
        params: { type: 'object', required: ['sha256'], properties: { sha256: { type: 'string', pattern: '^[0-9a-fA-F]{64}$' } } },
        response: { 200: indicatorLookupSchema, 400: errorSchema },
      },
    },
    async (req) => {
      const sha256 = req.params.sha256.toLowerCase();
      const found = await store.getIndicator(sha256);
      if (found?.status !== 'active') return { sha256, known: false };
      const { campaign, evidence, fileKind } = toIntelIndicator(found);
      return { sha256, known: true, campaign, evidence, fileKind, ledger: found.ledger, txHash: found.txHash };
    },
  );

  app.get<{ Querystring: { cursor?: string; limit?: number } }>(
    '/v1/indicators',
    {
      schema: {
        summary: 'Page through active registry indicators',
        description: 'The source `dome intel update` reads.',
        tags: ['indicators'],
        querystring: {
          type: 'object',
          additionalProperties: false,
          properties: { cursor: { type: 'string', maxLength: 500 }, limit: { type: 'integer', minimum: 1, maximum: 500, default: 100 } },
        },
        response: { 200: indicatorPageSchema, 400: errorSchema },
      },
    },
    async (req) => {
      const page = await store.listIndicators(req.query.cursor ?? null, req.query.limit ?? 100);
      return { indicators: page.items.map(toIntelIndicator), nextCursor: page.nextCursor };
    },
  );
}
