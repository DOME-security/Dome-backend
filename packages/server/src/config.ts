export interface ServerConfig {
  port: number;
  host: string;
  databaseUrl: string;
  webhookSecret: string | undefined;
  corsOrigins: string[];
  trustProxy: boolean;
  scanRateLimitPerMinute: number;
  registry:
    | { rpcUrl: string; contractId: string; networkPassphrase: string; signerSecret: string | undefined }
    | undefined;
}

export class ConfigError extends Error {
  override name = 'ConfigError';
}

function int(env: NodeJS.ProcessEnv, name: string, fallback: number): number {
  const raw = env[name];
  if (raw === undefined || raw === '') return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0) throw new ConfigError(`${name} must be a non-negative integer`);
  return n;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  const databaseUrl = env.DATABASE_URL;
  if (!databaseUrl) throw new ConfigError('DATABASE_URL is required');
  const rpcUrl = env.STELLAR_RPC_URL;
  const contractId = env.REGISTRY_CONTRACT_ID;
  const networkPassphrase = env.STELLAR_NETWORK_PASSPHRASE;
  const registryParts = [rpcUrl, contractId, networkPassphrase].filter(Boolean).length;
  if (registryParts > 0 && registryParts < 3) {
    throw new ConfigError('set all of STELLAR_RPC_URL, REGISTRY_CONTRACT_ID and STELLAR_NETWORK_PASSPHRASE, or none');
  }
  return {
    port: int(env, 'PORT', 8080),
    host: env.HOST || '0.0.0.0',
    databaseUrl,
    webhookSecret: env.GITHUB_WEBHOOK_SECRET || undefined,
    corsOrigins: (env.CORS_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean),
    trustProxy: env.TRUST_PROXY === 'true',
    scanRateLimitPerMinute: int(env, 'SCAN_RATE_LIMIT_PER_MINUTE', 10),
    registry:
      rpcUrl && contractId && networkPassphrase
        ? { rpcUrl, contractId, networkPassphrase, signerSecret: env.REGISTRY_SIGNER_SECRET || undefined }
        : undefined,
  };
}
