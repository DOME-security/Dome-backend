import type { Finding, ScanResult, Severity } from '../types.js';

export const HONESTY_NOTICE = 'No known pattern found is not the same as safe.';

export const DOCS_BASE = 'https://github.com/dome-security/dome-backend/blob/main/docs/rules';

export function ruleDocUrl(ruleId: string): string {
  return `${DOCS_BASE}/${ruleId}.md`;
}

// Control, zero-width and bidi-override characters.
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g;

/**
 * Paths are the only repository-chosen text in a report. Strip control,
 * zero-width and bidi characters (which can disguise a path or inject terminal
 * escapes) and cap the length.
 */
export function cleanPath(path: string): string {
  const cleaned = path.replace(CONTROL, '�');
  return cleaned.length > 200 ? `${cleaned.slice(0, 197)}...` : cleaned;
}

export function ruleLabel(f: Finding): string {
  return [...f.relatedRules, f.ruleId].join(' + ');
}

export function counts(result: ScanResult): Record<Severity, number> {
  const out: Record<Severity, number> = { block: 0, review: 0, info: 0 };
  for (const f of result.findings) out[f.severity]++;
  return out;
}

export function locationLabel(f: Finding): string[] {
  return f.locations.map((l) => `${cleanPath(l.path)}${l.line ? `:${l.line}` : ''}`);
}
