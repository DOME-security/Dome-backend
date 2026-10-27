import { stat } from 'node:fs/promises';
import path from 'node:path';
import {
  cloneRepo,
  FsSource,
  GitTreeSource,
  gitChangedPaths,
  gitMergeBase,
  gitResolve,
  isCloneableUrl,
  type FileSource,
} from '@dome-security/engine';
import { UsageError } from './io.js';

export interface OpenedTarget {
  source: FileSource;
  diff?: { base: FileSource; changed: string[] };
  dispose(): Promise<void>;
}

/** Splits `base...head`, `base..head` or `base` (meaning `base...HEAD`). */
export function parseDiffSpec(spec: string): { base: string; head: string } {
  const [base, head] = spec.includes('...') ? spec.split('...') : spec.includes('..') ? spec.split('..') : [spec, 'HEAD'];
  if (!base || !head || base.startsWith('-') || head.startsWith('-')) throw new UsageError(`invalid --diff range: ${spec}`);
  return { base, head };
}

async function gitDiffTarget(repoDir: string, spec: string, label: string): Promise<Omit<OpenedTarget, 'dispose'>> {
  const { base, head } = parseDiffSpec(spec);
  const headSha = await gitResolve(repoDir, head);
  const mergeBase = await gitMergeBase(repoDir, await gitResolve(repoDir, base), headSha);
  return {
    source: new GitTreeSource(repoDir, headSha, label),
    diff: { base: new GitTreeSource(repoDir, mergeBase), changed: await gitChangedPaths(repoDir, mergeBase, headSha) },
  };
}

/**
 * Opens what `dome scan` was pointed at: a local folder (read from disk), a
 * local repository range (read from git objects), or an https URL (cloned
 * with --no-checkout into a temporary folder that is deleted afterwards).
 */
export async function openTarget(target: string, cwd: string, diffSpec?: string): Promise<OpenedTarget> {
  if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('git@')) {
    if (!isCloneableUrl(target)) throw new UsageError('only https:// repository URLs can be scanned');
    const clone = await cloneRepo(target, diffSpec ? {} : { depth: 1 });
    try {
      const opened = diffSpec
        ? await gitDiffTarget(clone.dir, diffSpec, target)
        : { source: new GitTreeSource(clone.dir, 'HEAD', target) };
      return { ...opened, dispose: clone.dispose };
    } catch (error) {
      await clone.dispose();
      throw error;
    }
  }
  const dir = path.resolve(cwd, target);
  const info = await stat(dir).catch(() => undefined);
  if (!info?.isDirectory()) throw new UsageError(`not a directory: ${target}`);
  if (diffSpec) return { ...(await gitDiffTarget(dir, diffSpec, target)), dispose: async () => {} };
  return { source: new FsSource(dir), dispose: async () => {} };
}
