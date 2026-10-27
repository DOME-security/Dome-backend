import type { FastifyInstance } from 'fastify';
import { scanForEvent, verifySignature } from '../github.js';
import type { Store } from '../store/types.js';

export function webhookRoutes(app: FastifyInstance, store: Store, secret: string | undefined): void {
  app.register(async (scoped) => {
    // Signatures cover the exact bytes GitHub sent, so keep the raw body.
    scoped.removeContentTypeParser('application/json');
    scoped.addContentTypeParser('application/json', { parseAs: 'buffer', bodyLimit: 26 * 1024 * 1024 }, (_req, body, done) =>
      done(null, body),
    );

    scoped.post('/v1/webhooks/github', { bodyLimit: 26 * 1024 * 1024 }, async (req, reply) => {
      if (!secret) return reply.code(503).send({ error: 'webhooks are not configured' });
      const body = req.body as Buffer;
      if (!Buffer.isBuffer(body) || !verifySignature(secret, body, req.headers['x-hub-signature-256'] as string | undefined)) {
        return reply.code(401).send({ error: 'invalid signature' });
      }
      const event = String(req.headers['x-github-event'] ?? '');
      let payload: unknown;
      try {
        payload = JSON.parse(body.toString('utf8'));
      } catch {
        return reply.code(400).send({ error: 'invalid JSON' });
      }
      const outcome = scanForEvent(event, payload as Parameters<typeof scanForEvent>[1]);
      if (outcome.kind === 'ignored') return reply.code(202).send({ ignored: outcome.reason });
      const { job } = await store.enqueueScan(outcome.scan);
      return reply.code(202).send({ scan: job.id });
    });
  });
}
