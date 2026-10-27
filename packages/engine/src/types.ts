/** How serious a finding is. Ordered: info < review < block. */
export type Severity = 'info' | 'review' | 'block';

export const SEVERITY_ORDER: Record<Severity, number> = { info: 0, review: 1, block: 2 };

export function maxSeverity(a: Severity, b: Severity): Severity {
  return SEVERITY_ORDER[a] >= SEVERITY_ORDER[b] ? a : b;
}

export type Category = 'autorun' | 'payload' | 'intel' | 'stellar';

export interface Reference {
  title: string;
  url: string;
}

export interface RuleDoc {
  /** Why this matters, in a few sentences. */
  why: string;
  /** Honest situations that also trigger the rule. */
  falsePositives: string;
  references: Reference[];
}

export interface RuleMeta {
  /** Stable identifier, e.g. `DOME-VSC-001`. */
  id: string;
  title: string;
  category: Category;
  /** Severity used when a reason does not set its own. */
  severity: Severity;
  /** One sentence describing what the rule detects. */
  summary: string;
  /**
   * Every reason the rule can report, keyed by a short id. Reasons are fixed
   * text written here: a finding can only point at a reason key, so text
   * chosen by the scanned repository can never reach a verdict.
   */
  reasons: Record<string, string>;
  doc: RuleDoc;
}

export interface Location {
  /** Repository-relative POSIX path. */
  path: string;
  /** 1-based line. */
  line?: number;
  /** 1-based column. */
  column?: number;
}

export interface Finding {
  ruleId: string;
  /** Other rules this finding was combined with during grading. */
  relatedRules: string[];
  severity: Severity;
  reasonKey: string;
  /** Fixed wording from the rule's `reasons`. */
  reason: string;
  locations: Location[];
  /** The finding is inside a configured fixture path and does not affect the verdict. */
  fixture?: boolean;
  /** The finding matches a hash-pinned `allow` entry in `.dome.yml`. */
  allowed?: boolean;
}

export type Verdict = 'clean' | 'review' | 'block' | 'incomplete';

export interface IncompleteRead {
  path: string;
  reason: 'too-large' | 'read-error' | 'invalid-config' | 'unsupported-entry';
}

export interface ScanResult {
  tool: { name: 'dome'; version: string };
  target: string;
  scope: 'full' | 'diff';
  verdict: Verdict;
  findings: Finding[];
  incomplete: IncompleteRead[];
  stats: { filesInTree: number; filesInScope: number; rulesRun: number };
}

/** Indicator data the engine matches against. Supplied by `@dome-security/intel`. */
export interface IntelSet {
  /** Lowercase hex SHA-256 digests of known-bad files. */
  hashes: ReadonlySet<string>;
  /** Byte strings published as campaign markers. */
  markers: readonly string[];
  /** Known malicious npm package names. */
  packages: ReadonlySet<string>;
  /** Known staging and C2 domains, lowercase. */
  domains: readonly string[];
}

export const EMPTY_INTEL: IntelSet = {
  hashes: new Set(),
  markers: [],
  packages: new Set(),
  domains: [],
};
