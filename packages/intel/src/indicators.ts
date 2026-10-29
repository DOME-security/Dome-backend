export type IndicatorKind = 'hash' | 'marker' | 'package' | 'domain';

export const INDICATOR_KINDS: readonly IndicatorKind[] = ['hash', 'marker', 'package', 'domain'];

export interface Indicator {
  kind: IndicatorKind;
  /** SHA-256 hex for hashes, a byte string for markers, a package name, or a domain. */
  value: string;
  campaign: string;
  /**
   * What justifies the listing; at least one entry. Each is a public
   * `https://` link, a `sha256:<hex>` digest of a published advisory (how
   * the Dome Registry records evidence), or `stellar-tx:<hex>`, the registry
   * transaction in which curators approved the indicator.
   */
  evidence: string[];
  /** ISO date the indicator was added. */
  added?: string;
}

export interface IndicatorFile {
  schemaVersion: 1;
  kind: IndicatorKind;
  entries: Omit<Indicator, 'kind'>[];
}

export class IndicatorError extends Error {
  override name = 'IndicatorError';
}

const VALUE_RULES: Record<IndicatorKind, RegExp> = {
  hash: /^[0-9a-f]{64}$/,
  // npm names: optional scope, lowercase, URL-safe characters.
  package: /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/,
  domain: /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/,
  // Markers must be long enough not to match ordinary code.
  marker: /^[\s\S]{12,512}$/,
};

const EVIDENCE = /^(?:https:\/\/\S{4,2000}|sha256:[0-9a-f]{64}|stellar-tx:[0-9a-f]{64})$/;

/** Validates one indicator; throws an IndicatorError describing the first problem. */
export function validateIndicator(raw: unknown, where = 'indicator'): Indicator {
  if (!raw || typeof raw !== 'object') throw new IndicatorError(`${where} must be an object`);
  const { kind, value, campaign, evidence, added } = raw as Record<string, unknown>;
  if (typeof kind !== 'string' || !INDICATOR_KINDS.includes(kind as IndicatorKind)) throw new IndicatorError(`${where}.kind is invalid`);
  if (typeof value !== 'string' || !VALUE_RULES[kind as IndicatorKind].test(value)) {
    throw new IndicatorError(`${where}.value is not a valid ${kind}`);
  }
  if (typeof campaign !== 'string' || !campaign.trim()) throw new IndicatorError(`${where}.campaign is required`);
  if (!Array.isArray(evidence) || evidence.length === 0 || !evidence.every((e) => typeof e === 'string' && EVIDENCE.test(e))) {
    throw new IndicatorError(`${where}.evidence must list at least one https:// link, sha256: digest or stellar-tx: hash`);
  }
  if (added !== undefined && (typeof added !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(added))) {
    throw new IndicatorError(`${where}.added must be an ISO date`);
  }
  return { kind: kind as IndicatorKind, value, campaign, evidence: evidence as string[], ...(added ? { added } : {}) };
}

export function validateIndicatorFile(raw: unknown, name: string): Indicator[] {
  if (!raw || typeof raw !== 'object') throw new IndicatorError(`${name} must be an object`);
  const file = raw as Partial<IndicatorFile>;
  if (file.schemaVersion !== 1) throw new IndicatorError(`${name}: unsupported schemaVersion`);
  if (!file.kind || !INDICATOR_KINDS.includes(file.kind)) throw new IndicatorError(`${name}: invalid kind`);
  if (!Array.isArray(file.entries)) throw new IndicatorError(`${name}: entries must be a list`);
  const seen = new Set<string>();
  return file.entries.map((entry, i) => {
    const indicator = validateIndicator({ ...entry, kind: file.kind }, `${name}.entries[${i}]`);
    if (seen.has(indicator.value)) throw new IndicatorError(`${name}: duplicate value at entries[${i}]`);
    seen.add(indicator.value);
    return indicator;
  });
}
