import { execFile, spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import type { FileSource, TreeEntry } from './types.js';

/**
 * Config overrides applied to every git invocation. A repository delivered as
 * an archive can carry its own `.git/config`; these settings make sure git
 * itself never runs a command or hook that the repository chose.
 */
const SAFE_CONFIG = [
  'core.fsmonitor=false',
  'core.hooksPath=/dev/null',
  'core.untrackedCache=false',
  'diff.external=',
  'protocol.allow=never',
  'protocol.https.allow=always',
  'protocol.file.allow=never',
  'submodule.recurse=false',
  'credential.helper=',
];

function gitArgs(args: readonly string[]): string[] {
  return [...SAFE_CONFIG.flatMap((c) => ['-c', c]), ...args];
}

function gitEnv(): NodeJS.ProcessEnv {
  return {
    PATH: process.env.PATH,
    HOME: os.tmpdir(),
    GIT_TERMINAL_PROMPT: '0',
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_GLOBAL: os.devNull,
    GIT_ASKPASS: '',
    GIT_PAGER: 'cat',
    LC_ALL: 'C',
  };
}

export class GitError extends Error {
  constructor(
    message: string,
    readonly stderr: string,
  ) {
    super(message);
    this.name = 'GitError';
  }
}

export function runGit(cwd: string, args: readonly string[], timeoutMs = 120_000): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    execFile(
      'git',
      gitArgs(args),
      { cwd, env: gitEnv(), encoding: 'buffer', maxBuffer: 256 * 1024 * 1024, timeout: timeoutMs },
      (error, stdout, stderr) => {
        if (error) {
          reject(new GitError(`git ${args[0]} failed`, stderr.toString('utf8')));
        } else {
          resolve(stdout);
        }
      },
    );
  });
}

interface PendingRead {
  resolve: (data: Uint8Array | undefined) => void;
  reject: (error: Error) => void;
}

/** Streams blobs through a single long-lived `git cat-file --batch` process. */
class CatFileBatch {
  private readonly proc: ChildProcessWithoutNullStreams;
  private readonly pending: PendingRead[] = [];
  private buffer: Buffer = Buffer.alloc(0);
  private expected: number | undefined;
  private failure: Error | undefined;

  constructor(cwd: string) {
    this.proc = spawn('git', gitArgs(['cat-file', '--batch']), { cwd, env: gitEnv() });
    this.proc.stdout.on('data', (chunk: Buffer) => this.onData(chunk));
    this.proc.on('error', (error) => this.fail(error));
    this.proc.on('close', () => this.fail(new GitError('git cat-file exited', '')));
  }

  read(oid: string): Promise<Uint8Array | undefined> {
    if (this.failure) return Promise.reject(this.failure);
    return new Promise((resolve, reject) => {
      this.pending.push({ resolve, reject });
      this.proc.stdin.write(`${oid}\n`);
    });
  }

  close(): void {
    this.proc.stdin.end();
  }

  private fail(error: Error): void {
    this.failure ??= error;
    for (const p of this.pending.splice(0)) p.reject(this.failure);
  }

  private onData(chunk: Buffer): void {
    this.buffer = this.buffer.length ? Buffer.concat([this.buffer, chunk]) : chunk;
    for (;;) {
      if (this.expected === undefined) {
        const nl = this.buffer.indexOf(0x0a);
        if (nl === -1) return;
        const header = this.buffer.subarray(0, nl).toString('utf8');
        this.buffer = this.buffer.subarray(nl + 1);
        if (header.endsWith(' missing')) {
          this.pending.shift()?.resolve(undefined);
          continue;
        }
        const size = Number(header.split(' ')[2]);
        if (!Number.isSafeInteger(size)) {
          this.fail(new GitError('unexpected cat-file header', header));
          return;
        }
        this.expected = size;
      }
      if (this.buffer.length < this.expected + 1) return;
      const data = new Uint8Array(this.buffer.subarray(0, this.expected));
      this.buffer = this.buffer.subarray(this.expected + 1);
      this.expected = undefined;
      this.pending.shift()?.resolve(data);
    }
  }
}

/**
 * Reads a tree straight from git objects at a revision, without a checkout.
 * Nothing in the working tree is touched and no filters, hooks or attributes
 * from the repository are applied.
 */
export class GitTreeSource implements FileSource {
  readonly label: string;
  private entries: Map<string, TreeEntry & { oid: string }> | undefined;
  private batch: CatFileBatch | undefined;

  constructor(
    private readonly repoDir: string,
    private readonly rev: string,
    label?: string,
  ) {
    this.label = label ?? `${repoDir}@${rev}`;
  }

  async list(): Promise<TreeEntry[]> {
    return [...(await this.index()).values()].map(({ path: p, kind, size }) => ({ path: p, kind, size }));
  }

  async read(relPath: string): Promise<Uint8Array | undefined> {
    const entry = (await this.index()).get(relPath);
    if (entry?.kind !== 'file') return undefined;
    this.batch ??= new CatFileBatch(this.repoDir);
    return this.batch.read(entry.oid);
  }

  async close(): Promise<void> {
    this.batch?.close();
    this.batch = undefined;
  }

  private async index(): Promise<Map<string, TreeEntry & { oid: string }>> {
    if (this.entries) return this.entries;
    const out = await runGit(this.repoDir, ['ls-tree', '-r', '-z', '--long', '--full-tree', this.rev, '--']);
    const entries = new Map<string, TreeEntry & { oid: string }>();
    for (const record of out.toString('utf8').split('\0')) {
      if (!record) continue;
      const tab = record.indexOf('\t');
      const [mode, , oid, size] = record.slice(0, tab).split(/ +/);
      const relPath = record.slice(tab + 1);
      if (!mode || !oid) continue;
      const kind = mode === '120000' ? 'symlink' : mode === '160000' ? 'submodule' : 'file';
      entries.set(relPath, { path: relPath, kind, size: Number(size) || 0, oid });
    }
    this.entries = entries;
    return entries;
  }
}

/** Paths changed between the merge base of `base` and `head`, as with `git diff base...head`. */
export async function gitChangedPaths(repoDir: string, base: string, head: string): Promise<string[]> {
  const out = await runGit(repoDir, [
    'diff',
    '--name-only',
    '-z',
    '--no-renames',
    '--no-ext-diff',
    '--no-textconv',
    `${base}...${head}`,
    '--',
  ]);
  return out.toString('utf8').split('\0').filter(Boolean);
}

export async function gitMergeBase(repoDir: string, base: string, head: string): Promise<string> {
  return (await runGit(repoDir, ['merge-base', base, head])).toString('utf8').trim();
}

export async function gitResolve(repoDir: string, rev: string): Promise<string> {
  return (await runGit(repoDir, ['rev-parse', '--verify', '--end-of-options', `${rev}^{commit}`])).toString('utf8').trim();
}

const CLONE_URL = /^https:\/\/[A-Za-z0-9.-]+(?::\d+)?\/[A-Za-z0-9._~\-/]+$/;

export function isCloneableUrl(url: string): boolean {
  return CLONE_URL.test(url) && !url.includes('..');
}

export interface ClonedRepo {
  dir: string;
  dispose(): Promise<void>;
}

/**
 * Clones a public HTTPS repository with `--no-checkout` into a temporary
 * directory. Only git objects are fetched; no file is written to a working
 * tree and no hook can run.
 */
export async function cloneRepo(
  url: string,
  options: { depth?: number; ref?: string; timeoutMs?: number } = {},
): Promise<ClonedRepo> {
  if (!isCloneableUrl(url)) throw new GitError('only https:// repository URLs can be scanned', '');
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dome-clone-'));
  const dispose = () => rm(dir, { recursive: true, force: true });
  try {
    const args = ['clone', '--no-checkout', '--quiet', '--no-recurse-submodules', '--no-tags'];
    if (options.depth) args.push('--depth', String(options.depth));
    if (options.ref) args.push('--branch', options.ref);
    args.push('--', url, dir);
    await runGit(os.tmpdir(), args, options.timeoutMs ?? 300_000);
    return { dir, dispose };
  } catch (error) {
    await dispose();
    throw error;
  }
}

/** Fetches a single commit into an existing clone (used for pull request heads). */
export async function fetchCommit(repoDir: string, remoteRef: string, timeoutMs = 300_000): Promise<void> {
  await runGit(repoDir, ['fetch', '--quiet', '--no-tags', '--no-recurse-submodules', 'origin', '--', remoteRef], timeoutMs);
}
