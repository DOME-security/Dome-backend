import { Keypair, RegistryClient } from '@dome-security/registry-client';
import { buildApp } from '../app.js';
import { loadConfig } from '../config.js';
import { publishPending } from '../publisher.js';
import { PgStore } from '../store/pg.js';

const config = loadConfig();
const store = PgStore.connect(config.databaseUrl);
const app = await buildApp({
  store,
  webhookSecret: config.webhookSecret,
  corsOrigins: config.corsOrigins,
  trustProxy: config.trustProxy,
  scanRateLimitPerMinute: config.scanRateLimitPerMinute,
  logger: true,
});

let timer: NodeJS.Timeout | undefined;
if (config.registry?.signerSecret) {
  const registry = new RegistryClient(config.registry);
  const signer = Keypair.fromSecret(config.registry.signerSecret);
  const tick = async () => {
    try {
      await publishPending({ store, registry, signer, log: (msg, extra) => app.log.warn(extra, msg) });
    } finally {
      timer = setTimeout(tick, 15_000);
    }
  };
  timer = setTimeout(tick, 5_000);
  app.log.info('publishing attestations to the Dome Registry');
}

const shutdown = async () => {
  clearTimeout(timer);
  await app.close();
  await store.close();
};
process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);

await app.listen({ port: config.port, host: config.host });
