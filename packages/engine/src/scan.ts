import { CONFIG_PATH, ConfigError, EMPTY_CONFIG, parseConfig, type DomeConfig } from './config.js';
import { grade } from './grade.js';
import { sha256Hex } from './hash.js';
import { UncheckableInput } from './parsers/errors.js';
import { sanitizePath } from './report/common.js';
import { decodeText, LineIndex } from './parsers/text.js';
import { ALL_RULES } from './rules/index.js';
import { rulesetHash } from './ruleset.js';
import type { Rule, RuleContext } from './rules/rule.js';
import type { FileSource, TreeEntry } from './source/types.js';
import { EMPTY_INTEL, type Finding, type IncompleteRead, type IntelSet, type Location, type ScanResult, type Severity, type Verdict } from './types.js';
import { VERSION } from './version.js';

export const DEFAULT_MAX_FILE_BYTES = 8 * 1024 * 1024;

export interface ScanOptions {
  source: FileSource;
  /** For diff scans: the tree at the merge base, and the paths that changed. */
  diff?: { base: FileSource; changed: readonly string[] };
  intel?: IntelSet;
  /**
   * Configuration to apply. When omitted, `.dome.yml` is read from the base
   * tree in a diff scan (so a pull request cannot loosen its own checks) or
   * from the scanned tree in a full scan.
   */
  config?: DomeConfig;
  /**
   * Whether a `.dome.yml` read from the repository is trusted. Untrusted (the
   * default) means the repository can only raise severities: its `fixtures`,
   * `allow` entries and lowering overrides are ignored, so a hostile
   * repository cannot mark its own payload as a fixture. Trust it only when
   * the file comes from a branch you control, such as the protected base of
   * your own pull request. A `config` passed in directly is always trusted.
   */
  repoConfig?: 'trusted' | 'untrusted';
  rules?: readonly Rule[];
  maxFileBytes?: number;
}

class FileCache {
  private readonly bytes = new Map<string, Promise<Uint8Array | undefined>>();
  private readonly texts = new Map<string, Promise<string | undefined>>();
  private readonly lines = new Map<string, LineIndex>();

  constructor(
    private readonly source: FileSource,
    private readonly tree: ReadonlyMap<string, TreeEntry>,
    private readonly maxBytes: number,
    private readonly incomplete: Map<string, IncompleteRead> | undefined,
  ) {}

  readBytes(path: string): Promise<Uint8Array | undefined> {
    let p = this.bytes.get(path);
    if (!p) {
      p = this.load(path);
      this.bytes.set(path, p);
    }
    return p;
  }

  readText(path: string): Promise<string | undefined> {
    let p = this.texts.get(path);
    if (!p) {
      p = this.readBytes(path).then((b) => {
        if (b === undefined) return undefined;
        const text = decodeText(b);
        this.lines.set(path, new LineIndex(text));
        return text;
      });
      this.texts.set(path, p);
    }
    return p;
  }

  locate(path: string, offset: number): Location {
    const index = this.lines.get(path);
    if (!index) return { path };
    return { path, ...index.position(offset) };
  }

  private async load(path: string): Promise<Uint8Array | undefined> {
    const entry = this.tree.get(path);
    if (!entry) return undefined;
    if (entry.kind !== 'file') {
      if (entry.kind === 'symlink') this.incomplete?.set(path, { path, reason: 'unsupported-entry' });
      return undefined;
    }
    if (entry.size > this.maxBytes) {
      this.incomplete?.set(path, { path, reason: 'too-large' });
      return undefined;
    }
    try {
      return await this.source.read(path);
    } catch {
      this.incomplete?.set(path, { path, reason: 'read-error' });
      return undefined;
    }
  }
}

export function verdictOf(findings: readonly Finding[], incomplete: readonly IncompleteRead[]): Verdict {
  if (findings.some((f) => f.severity === 'block')) return 'block';
  if (incomplete.length > 0) return 'incomplete';
  if (findings.some((f) => f.severity === 'review')) return 'review';
  return 'clean';
}

/** Runs every rule over a tree and grades the findings. Nothing in the tree is executed. */
export async function scan(options: ScanOptions): Promise<ScanResult> {
  const rules = options.rules ?? ALL_RULES;
  const intel = options.intel ?? EMPTY_INTEL;
  const maxBytes = options.maxFileBytes ?? DEFAULT_MAX_FILE_BYTES;
  const incomplete = new Map<string, IncompleteRead>();

  const entries = await options.source.list();
  const tree = new Map(entries.map((e) => [e.path, e]));
  const changed = options.diff ? new Set(options.diff.changed) : undefined;
  const targets = changed ? entries.filter((e) => changed.has(e.path)) : entries;
  const files = new FileCache(options.source, tree, maxBytes, incomplete);

  let baseFiles: FileCache | undefined;
  if (options.diff) {
    const baseEntries = await options.diff.base.list();
    baseFiles = new FileCache(options.diff.base, new Map(baseEntries.map((e) => [e.path, e])), maxBytes, undefined);
  }

  let config = options.config;
  let trusted = true;
  if (!config) {
    trusted = options.repoConfig === 'trusted';
    const configText = await (baseFiles ?? files).readText(CONFIG_PATH);
    config = EMPTY_CONFIG;
    if (configText !== undefined) {
      try {
        config = parseConfig(configText);
      } catch (error) {
        if (!(error instanceof ConfigError)) throw error;
        // An untrusted config cannot loosen anything, so a broken one changes nothing.
        if (trusted) incomplete.set(CONFIG_PATH, { path: CONFIG_PATH, reason: 'invalid-config' });
      }
    }
    if (!trusted) config = { fixtures: [], allow: [], severity: config.severity };
  }

  const raw: Finding[] = [];
  for (const rule of rules) {
    // The file a rule read last, so a failure can be pinned on it.
    let current: string | undefined;
    const ctx: RuleContext = {
      scope: options.diff ? 'diff' : 'full',
      targets,
      tree,
      intel,
      maxFileBytes: maxBytes,
      readText: (p) => {
        current = p;
        return files.readText(p);
      },
      readBytes: (p) => {
        current = p;
        return files.readBytes(p);
      },
      readBaseText: async (p) => (baseFiles ? baseFiles.readText(p) : undefined),
      isChanged: (p) => !changed || changed.has(p),
      locate: (p, offset) => files.locate(p, offset),
      report: (reasonKey: string, locations: Location | Location[], severity?: Severity) => {
        const reason = (rule.meta.reasons as Record<string, string>)[reasonKey];
        if (reason === undefined) throw new Error(`${rule.meta.id} reported unknown reason ${reasonKey}`);
        raw.push({
          ruleId: rule.meta.id,
          relatedRules: [],
          severity: severity ?? rule.meta.severity,
          reasonKey,
          reason,
          locations: Array.isArray(locations) ? locations : [locations],
        });
      },
      couldNotCheck: (path, reason) => {
        if (!incomplete.has(path)) incomplete.set(path, { path, reason });
      },
    };
    try {
      await rule.run(ctx);
    } catch (error) {
      // A rule that cannot finish (a refused or hostile input, or a bug) must
      // not abort the scan or let it pass: the file is reported as not checked.
      const path = current ?? '.';
      const reason = error instanceof UncheckableInput ? 'parse-error' : 'rule-error';
      if (!incomplete.has(path)) incomplete.set(path, { path, reason, ruleId: rule.meta.id });
    }
  }

  const findings = await grade({
    findings: raw,
    config,
    allowLowering: trusted,
    scope: options.diff ? 'diff' : 'full',
    hashOf: async (p) => {
      const bytes = await files.readBytes(p);
      return bytes ? sha256Hex(bytes) : undefined;
    },
  });

  await options.source.close?.();
  await options.diff?.base.close?.();

  const incompleteList = [...incomplete.values()]
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((i) => ({ ...i, path: sanitizePath(i.path) }));
  // Paths are the only repository-chosen text in a result; every consumer
  // (JSON, the API, the stored report and its hash) gets them sanitized.
  for (const f of findings) f.locations = f.locations.map((l) => ({ ...l, path: sanitizePath(l.path) }));
  return {
    tool: { name: 'dome', version: VERSION, rulesHash: rulesetHash(rules, intel) },
    target: sanitizePath(options.source.label),
    scope: options.diff ? 'diff' : 'full',
    verdict: verdictOf(findings, incompleteList),
    findings,
    incomplete: incompleteList,
    stats: { filesInTree: entries.length, filesInScope: targets.length, rulesRun: rules.length },
  };
}

/** CLI exit code for a verdict: 0 clean, 1 review, 2 block, 3 could not check. */
export function exitCodeFor(verdict: Verdict): number {
  return { clean: 0, review: 1, block: 2, incomplete: 3 }[verdict];
}
