import os from 'node:os';
import { PgStore } from '@dome-security/server/store';
import { runWorker } from '../worker.js';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  process.stderr.write('DATABASE_URL is required\n');
  process.exit(64);
}

const store = PgStore.connect(databaseUrl, 2);
const controller = new AbortController();
const stop = () => controller.abort();
process.once('SIGTERM', stop);
process.once('SIGINT', stop);

const log = (msg: string, extra: Record<string, unknown> = {}) =>
  process.stdout.write(`${JSON.stringify({ time: new Date().toISOString(), msg, ...extra })}\n`);

await runWorker({
  store,
  workerId: process.env.WORKER_ID || os.hostname(),
  pollIntervalMs: Number(process.env.POLL_INTERVAL_MS) || 2000,
  jobTimeoutMs: Number(process.env.JOB_TIMEOUT_MS) || 10 * 60_000,
  signal: controller.signal,
  log,
});
await store.close();
