import { RegistryClient } from '@dome-security/registry-client';
import { PgStore } from '@dome-security/server/store';
import { runIndexer } from '../indexer.js';

const env = process.env;
const missing = ['DATABASE_URL', 'STELLAR_RPC_URL', 'REGISTRY_CONTRACT_ID', 'STELLAR_NETWORK_PASSPHRASE', 'INDEXER_START_LEDGER'].filter(
  (name) => !env[name],
);
if (missing.length > 0) {
  process.stderr.write(`missing configuration: ${missing.join(', ')}\n`);
  process.exit(64);
}
const startLedger = Number(env.INDEXER_START_LEDGER);
if (!Number.isInteger(startLedger) || startLedger < 1) {
  process.stderr.write('INDEXER_START_LEDGER must be a ledger number\n');
  process.exit(64);
}

const store = PgStore.connect(env.DATABASE_URL!, 2);
const registry = new RegistryClient({
  rpcUrl: env.STELLAR_RPC_URL!,
  contractId: env.REGISTRY_CONTRACT_ID!,
  networkPassphrase: env.STELLAR_NETWORK_PASSPHRASE!,
});
const controller = new AbortController();
process.once('SIGTERM', () => controller.abort());
process.once('SIGINT', () => controller.abort());

const log = (msg: string, extra: Record<string, unknown> = {}) =>
  process.stdout.write(`${JSON.stringify({ time: new Date().toISOString(), msg, ...extra })}\n`);

await runIndexer({ store, registry, startLedger, signal: controller.signal, log });
await store.close();
