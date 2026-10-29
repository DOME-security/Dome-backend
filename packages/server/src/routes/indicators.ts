import type { FastifyInstance } from 'fastify';
import { toIntelIndicator, type Store } from '../store/types.js';

export function indicatorRoutes(app: FastifyInstance, store: Store): void {
  app.get<{ Params: { sha256: string } }>('/v1/indicators/:sha256', async (req, reply) => {
    const sha256 = req.params.sha256.toLowerCase();
    if (!/^[0-9a-f]{64}$/.test(sha256)) return reply.code(400).send({ error: 'expected a SHA-256 hex digest' });
    const found = await store.getIndicator(sha256);
    if (found?.status !== 'active') return { sha256, known: false };
    const { campaign, evidence, fileKind } = toIntelIndicator(found);
    return { sha256, known: true, campaign, evidence, fileKind, ledger: found.ledger, txHash: found.txHash };
  });

  app.get<{ Querystring: { cursor?: string; limit?: number } }>(
    '/v1/indicators',
    {
      schema: {
        querystring: {
          type: 'object',
          additionalProperties: false,
          properties: { cursor: { type: 'string', maxLength: 500 }, limit: { type: 'integer', minimum: 1, maximum: 500, default: 100 } },
        },
      },
    },
    async (req) => {
      const page = await store.listIndicators(req.query.cursor ?? null, req.query.limit ?? 100);
      return {
        indicators: page.items.map(toIntelIndicator),
        nextCursor: page.nextCursor,
      };
    },
  );
}
