import picomatch from 'picomatch';
import { parseDocument } from 'yaml';
import type { Severity } from './types.js';

export interface AllowEntry {
  rule: string;
  file: string;
  /** Lowercase hex SHA-256 of the file content that was reviewed. */
  sha256: string;
  reason: string;
}

export interface DomeConfig {
  fixtures: string[];
  allow: AllowEntry[];
  severity: Record<string, Severity>;
}

export const EMPTY_CONFIG: DomeConfig = { fixtures: [], allow: [], severity: {} };

export const CONFIG_PATH = '.dome.yml';

const SEVERITIES = new Set(['info', 'review', 'block']);
const RULE_ID = /^DOME-[A-Z]{3}-\d{3}$/;

export class ConfigError extends Error {
  override name = 'ConfigError';
}

/**
 * Parses `.dome.yml`. Anything unexpected is an error rather than being
 * ignored, so a typo cannot silently drop a hash-pinned exception or a
 * severity change.
 */
export function parseConfig(text: string): DomeConfig {
  const doc = parseDocument(text, { strict: true, uniqueKeys: true });
  if (doc.errors.length) throw new ConfigError('invalid YAML');
  const data = doc.toJS({ maxAliasCount: 10 }) as unknown;
  if (data === null || data === undefined) return EMPTY_CONFIG;
  if (typeof data !== 'object' || Array.isArray(data)) throw new ConfigError('top level must be a mapping');
  const raw = data as Record<string, unknown>;
  for (const key of Object.keys(raw)) {
    if (!['fixtures', 'allow', 'severity'].includes(key)) throw new ConfigError(`unknown key: ${key}`);
  }

  const fixtures = raw.fixtures ?? [];
  if (!Array.isArray(fixtures) || !fixtures.every((f) => typeof f === 'string' && f.length > 0)) {
    throw new ConfigError('fixtures must be a list of glob strings');
  }

  const allowRaw = raw.allow ?? [];
  if (!Array.isArray(allowRaw)) throw new ConfigError('allow must be a list');
  const allow = allowRaw.map((entry, i): AllowEntry => {
    if (!entry || typeof entry !== 'object') throw new ConfigError(`allow[${i}] must be a mapping`);
    const { rule, file, sha256, reason } = entry as Record<string, unknown>;
    if (typeof rule !== 'string' || !RULE_ID.test(rule)) throw new ConfigError(`allow[${i}].rule must be a rule id`);
    if (typeof file !== 'string' || !file) throw new ConfigError(`allow[${i}].file is required`);
    if (typeof sha256 !== 'string' || !/^[0-9a-f]{64}$/i.test(sha256)) throw new ConfigError(`allow[${i}].sha256 must be a SHA-256 hex digest`);
    if (typeof reason !== 'string' || !reason.trim()) throw new ConfigError(`allow[${i}].reason is required`);
    return { rule, file, sha256: sha256.toLowerCase(), reason };
  });

  const severityRaw = raw.severity ?? {};
  if (!severityRaw || typeof severityRaw !== 'object' || Array.isArray(severityRaw)) throw new ConfigError('severity must be a mapping');
  const severity: Record<string, Severity> = {};
  for (const [rule, level] of Object.entries(severityRaw as Record<string, unknown>)) {
    if (!RULE_ID.test(rule)) throw new ConfigError(`severity: ${rule} is not a rule id`);
    if (typeof level !== 'string' || !SEVERITIES.has(level)) throw new ConfigError(`severity.${rule} must be info, review or block`);
    severity[rule] = level as Severity;
  }

  return { fixtures: fixtures as string[], allow, severity };
}

export function fixtureMatcher(config: DomeConfig): (path: string) => boolean {
  if (config.fixtures.length === 0) return () => false;
  return picomatch(config.fixtures, { dot: true });
}
