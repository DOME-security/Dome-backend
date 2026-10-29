import rateLimit from '@fastify/rate-limit';
import Fastify, { type FastifyInstance, type RouteOptions } from 'fastify';
import { indicatorRoutes } from './routes/indicators.js';
import { repoRoutes } from './routes/repos.js';
import { scanRoutes } from './routes/scans.js';
import { webhookRoutes } from './routes/webhooks.js';
import type { Store } from './store/types.js';

export interface AppOptions {
  store: Store;
  webhookSecret?: string;
  corsOrigins?: string[];
  trustProxy?: boolean;
  scanRateLimitPerMinute?: number;
  logger?: boolean;
  /** Called for every route as it is registered; the OpenAPI generator uses it. */
  onRoute?: (route: RouteOptions) => void;
}

export async function buildApp(options: AppOptions): Promise<FastifyInstance> {
  const app = Fastify({
    logger: options.logger ?? false,
    trustProxy: options.trustProxy ?? false,
    bodyLimit: 64 * 1024,
    // Reject unexpected fields instead of silently dropping them.
    ajv: { customOptions: { removeAdditional: false, coerceTypes: 'array' } },
  });

  if (options.onRoute) app.addHook('onRoute', options.onRoute);
  await app.register(rateLimit, { global: false });

  const origins = new Set(options.corsOrigins ?? []);
  app.addHook('onRequest', async (req, reply) => {
    const origin = req.headers.origin;
    if (origin && origins.has(origin)) {
      reply.header('access-control-allow-origin', origin).header('vary', 'origin');
      if (req.method === 'OPTIONS') {
        reply
          .header('access-control-allow-methods', 'GET, POST')
          .header('access-control-allow-headers', 'content-type')
          .header('access-control-max-age', '600')
          .code(204)
          .send();
      }
    }
  });
  app.addHook('onSend', async (_req, reply) => {
    reply.header('x-content-type-options', 'nosniff').header('cache-control', 'no-store');
  });

  app.setErrorHandler((error, req, reply) => {
    const status = error.statusCode ?? 500;
    if (status >= 500) req.log.error(error);
    reply.code(status).send({ error: status >= 500 ? 'internal error' : error.message });
  });

  app.get(
    '/healthz',
    {
      schema: {
        summary: 'Liveness check',
        tags: ['meta'],
        response: { 200: { type: 'object', required: ['ok'], properties: { ok: { type: 'boolean' } } } },
      },
    },
    async () => ({ ok: true }),
  );
  scanRoutes(app, options.store, options.scanRateLimitPerMinute ?? 10);
  repoRoutes(app, options.store);
  indicatorRoutes(app, options.store);
  webhookRoutes(app, options.store, options.webhookSecret);
  return app;
}
