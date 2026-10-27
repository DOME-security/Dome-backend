import type { TreeEntry } from '../source/types.js';
import type { IntelSet, Location, RuleMeta, Severity } from '../types.js';

export interface RuleContext<R extends string = string> {
  readonly scope: 'full' | 'diff';
  /** Files the scan is about: the whole tree, or what a diff changed. */
  readonly targets: readonly TreeEntry[];
  /** Every entry in the scanned tree, for resolving references. */
  readonly tree: ReadonlyMap<string, TreeEntry>;
  readonly intel: IntelSet;
  /** Files above this size are not read; reading one marks the scan incomplete. */
  readonly maxFileBytes: number;
  readText(path: string): Promise<string | undefined>;
  readBytes(path: string): Promise<Uint8Array | undefined>;
  /** In a diff scan, the file at the merge base; `undefined` when it did not exist or in a full scan. */
  readBaseText(path: string): Promise<string | undefined>;
  /** True when the file changed in a diff scan (always true in a full scan). */
  isChanged(path: string): boolean;
  /** Converts a character offset in a file already read with `readText` to a location. */
  locate(path: string, offset: number): Location;
  report(reason: R, locations: Location | Location[], severity?: Severity): void;
}

export interface Rule<R extends string = string> {
  meta: RuleMeta & { reasons: Record<R, string> };
  run(ctx: RuleContext<R>): Promise<void>;
}

export function defineRule<const R extends string>(
  meta: RuleMeta & { reasons: Record<R, string> },
  run: (ctx: RuleContext<R>) => Promise<void>,
): Rule<R> {
  return { meta, run };
}

/**
 * Targets whose path satisfies `match`. Symlinks are included so that reading
 * one records the path as not checked instead of silently skipping it.
 */
export function targetsWhere(ctx: RuleContext, match: (path: string) => boolean): TreeEntry[] {
  return ctx.targets.filter((t) => t.kind !== 'submodule' && match(t.path));
}
