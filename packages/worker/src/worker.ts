import {
  cloneRepo,
  fetchCommit,
  gitChangedPaths,
  gitMergeBase,
  gitResolve,
  GitTreeSource,
  scan,
  type ClonedRepo,
  type IntelSet,
  type ScanResult,
} from '@dome-security/engine';
import { bundledIndicators, toIntelSet, type Indicator } from '@dome-security/intel';
import { toIntelIndicator, type ScanJob, type Store } from '@dome-security/server/store';

export interface GitOps {
  clone(url: string, options: { depth?: number; ref?: string }): Promise<ClonedRepo>;
  fetch(repoDir: string, ref: string): Promise<void>;
}

export const realGit: GitOps = {
  clone: (url, options) => cloneRepo(url, options),
  fetch: (dir, ref) => fetchCommit(dir, ref),
};

export class JobError extends Error {
  override name = 'JobError';
}

/**
 * Scans one job. The repository is cloned with --no-checkout and read as git
 * objects; there is no code path that runs anything from it.
 */
export async function processJob(job: ScanJob, intel: IntelSet, git: GitOps = realGit): Promise<{ result: ScanResult; headSha: string }> {
  const isPullRequest = job.pullRequest !== null;
  let clone: ClonedRepo;
  try {
    clone = await git.clone(`${job.repoUrl}.git`, isPullRequest ? {} : { depth: 1, ...(job.ref ? { ref: job.ref } : {}) });
  } catch {
    throw new JobError('could not clone the repository (is it public?)');
  }
  try {
    let headSha: string;
    if (isPullRequest) {
      await git.fetch(clone.dir, `refs/pull/${job.pullRequest}/head`).catch(() => {
        throw new JobError('could not fetch the pull request head');
      });
      headSha = job.headSha ?? (await gitResolve(clone.dir, 'FETCH_HEAD'));
    } else {
      headSha = await gitResolve(clone.dir, 'HEAD');
      if (job.headSha && job.headSha !== headSha) {
        await git.fetch(clone.dir, job.headSha).catch(() => {
          throw new JobError('could not fetch the requested commit');
        });
        headSha = job.headSha;
      }
    }

    let diff: { base: GitTreeSource; changed: string[] } | undefined;
    if (isPullRequest && job.baseSha) {
      const mergeBase = await gitMergeBase(clone.dir, job.baseSha, headSha).catch(() => {
        throw new JobError('could not find the pull request base');
      });
      diff = { base: new GitTreeSource(clone.dir, mergeBase), changed: await gitChangedPaths(clone.dir, mergeBase, headSha) };
    }
    // The service scans other people's repositories: their .dome.yml can raise severities, never lower them.
    const result = await scan({
      source: new GitTreeSource(clone.dir, headSha, `${job.owner}/${job.repo}`),
      diff,
      intel,
      repoConfig: 'untrusted',
    });
    return { result, headSha };
  } finally {
    await clone.dispose();
  }
}

/** Bundled indicators plus every active indicator approved on the Dome Registry. */
export async function loadIntel(store: Store): Promise<IntelSet> {
  const indicators: Indicator[] = bundledIndicators();
  let cursor: string | null = null;
  for (let page = 0; page < 1000; page++) {
    const res = await store.listIndicators(cursor, 500);
    indicators.push(...res.items.map((i) => { const { fileKind: _f, ...indicator } = toIntelIndicator(i); return indicator; }));
    cursor = res.nextCursor;
    if (!cursor) break;
  }
  return toIntelSet(indicators);
}

export interface WorkerOptions {
  store: Store;
  workerId: string;
  git?: GitOps;
  pollIntervalMs?: number;
  jobTimeoutMs?: number;
  maxAttempts?: number;
  intelRefreshMs?: number;
  signal?: AbortSignal;
  log?: (msg: string, extra?: Record<string, unknown>) => void;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new JobError('scan timed out')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/** Claims and processes at most one job. Returns false when the queue was empty. */
export async function runOnce(options: WorkerOptions, intel: IntelSet): Promise<boolean> {
  const timeout = options.jobTimeoutMs ?? 10 * 60_000;
  const job = await options.store.claimScan(options.workerId, timeout * 2, options.maxAttempts ?? 3);
  if (!job) return false;
  options.log?.('scan started', { scan: job.id, repo: `${job.owner}/${job.repo}` });
  try {
    const { result, headSha } = await withTimeout(processJob(job, intel, options.git), timeout);
    await options.store.completeScan(job.id, result, { attestable: job.pullRequest === null, headSha });
    options.log?.('scan finished', { scan: job.id, verdict: result.verdict });
  } catch (error) {
    const message = error instanceof JobError ? error.message : 'scan failed';
    await options.store.failScan(job.id, message);
    options.log?.('scan failed', { scan: job.id, error: (error as Error).message });
  }
  return true;
}

/** Polls the queue until the signal aborts. One job at a time; scale by running more containers. */
export async function runWorker(options: WorkerOptions): Promise<void> {
  const poll = options.pollIntervalMs ?? 2000;
  const refresh = options.intelRefreshMs ?? 5 * 60_000;
  let intel = await loadIntel(options.store);
  let loadedAt = Date.now();
  while (!options.signal?.aborted) {
    if (Date.now() - loadedAt > refresh) {
      intel = await loadIntel(options.store).catch(() => intel);
      loadedAt = Date.now();
    }
    const worked = await runOnce(options, intel).catch((error: unknown) => {
      options.log?.('queue error', { error: (error as Error).message });
      return false;
    });
    if (!worked) await new Promise((r) => setTimeout(r, poll));
  }
}
