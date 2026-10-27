import { createHash } from 'node:crypto';
import type { ScanResult } from '@dome-security/engine';

/** JSON with object keys sorted at every level, so the same report always hashes the same. */
export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

/** The hash published on chain for a scan report. Anyone can recompute it from GET /v1/scans/:id. */
export function reportHash(report: ScanResult): string {
  return createHash('sha256').update(canonicalJson(report)).digest('hex');
}
