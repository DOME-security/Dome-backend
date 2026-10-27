import { EMPTY_CONFIG, type DomeConfig } from '../config.js';
import type { Rule } from '../rules/rule.js';
import { scan } from '../scan.js';
import { MemorySource } from '../source/memory.js';
import { EMPTY_INTEL, type Finding, type IntelSet, type ScanResult } from '../types.js';

export interface RunOptions {
  /** Files at the merge base; when given, the scan is a diff scan of the paths that differ. */
  base?: Record<string, string | Uint8Array>;
  intel?: Partial<IntelSet>;
  config?: DomeConfig;
  rules?: Rule[];
}

function changedPaths(base: Record<string, string | Uint8Array>, head: Record<string, string | Uint8Array>): string[] {
  const same = (a: string | Uint8Array | undefined, b: string | Uint8Array | undefined) =>
    a !== undefined && b !== undefined && Buffer.from(a).equals(Buffer.from(b));
  const paths = new Set([...Object.keys(base), ...Object.keys(head)]);
  return [...paths].filter((p) => !same(base[p], head[p]));
}

/** Scans an in-memory tree with the given rules (ungraded config by default). */
export async function scanFiles(files: Record<string, string | Uint8Array>, options: RunOptions = {}): Promise<ScanResult> {
  return scan({
    source: new MemorySource(files),
    diff: options.base ? { base: new MemorySource(options.base), changed: changedPaths(options.base, files) } : undefined,
    intel: { ...EMPTY_INTEL, ...options.intel },
    config: options.config ?? EMPTY_CONFIG,
    rules: options.rules,
  });
}

/** Runs a single rule and returns its findings as `RULE:severity:reason@path:line` strings. */
export async function runRule(
  rule: Rule,
  files: Record<string, string | Uint8Array>,
  options: Omit<RunOptions, 'rules'> = {},
): Promise<string[]> {
  const result = await scanFiles(files, { ...options, rules: [rule] });
  return result.findings.map(describe);
}

export function describe(f: Finding): string {
  const loc = f.locations[0];
  return `${f.severity}:${f.reasonKey}@${loc?.path}${loc?.line ? `:${loc.line}` : ''}`;
}
