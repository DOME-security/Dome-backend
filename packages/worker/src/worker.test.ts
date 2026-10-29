import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { EMPTY_INTEL } from '@dome-security/engine';
import { MemoryStore } from '@dome-security/server/store';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { loadIntel, runOnce, type GitOps } from './worker.js';

let origin: string;
let base: string;
let head: string;

const git = (cwd: string, ...args: string[]) =>
  execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.com', '-c', 'commit.gpgsign=false', ...args], { cwd })
    .toString()
    .trim();

/** Local stand-in for GitHub: clones and fetches from a folder instead of https. */
const localGit: GitOps = {
  async clone(_url, options) {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'dome-worker-clone-'));
    const args = ['clone', '--no-checkout', '--quiet'];
    if (options.depth) args.push('--depth', String(options.depth), `file://${origin}`);
    else args.push(origin);
    git(os.tmpdir(), ...args, dir);
    return { dir, dispose: () => rm(dir, { recursive: true, force: true }) };
  },
  async fetch(dir, ref) {
    git(dir, 'fetch', '--quiet', 'origin', ref);
  },
};

beforeAll(async () => {
  origin = await mkdtemp(path.join(os.tmpdir(), 'dome-worker-origin-'));
  git(origin, 'init', '-q', '-b', 'main');
  await writeFile(path.join(origin, 'index.js'), 'console.log(1)\n');
  git(origin, 'add', '.');
  git(origin, 'commit', '-q', '-m', 'base');
  base = git(origin, 'rev-parse', 'HEAD');
  git(origin, 'checkout', '-q', '-b', 'pr');
  await mkdir(path.join(origin, '.vscode'));
  await mkdir(path.join(origin, 'public'));
  await writeFile(path.join(origin, '.vscode/tasks.json'), JSON.stringify({ tasks: [{ command: 'node public/a.woff2' }] }));
  await writeFile(path.join(origin, 'public/a.woff2'), 'DOME_FIXTURE_NOT_A_FONT');
  git(origin, 'add', '.');
  git(origin, 'commit', '-q', '-m', 'payload');
  head = git(origin, 'rev-parse', 'HEAD');
  git(origin, 'update-ref', 'refs/pull/7/head', head);
  git(origin, 'checkout', '-q', 'main');
});

afterAll(async () => {
  await rm(origin, { recursive: true, force: true });
});

describe('worker', () => {
  it('scans a default-branch job and marks it attestable', async () => {
    const store = new MemoryStore();
    const { job } = await store.enqueueScan({ repoUrl: 'https://github.com/o/r', owner: 'o', repo: 'r', source: 'api' });
    expect(await runOnce({ store, workerId: 'w', git: localGit }, EMPTY_INTEL)).toBe(true);
    expect(store.scans.get(job.id)).toMatchObject({ status: 'done', verdict: 'clean', headSha: base, attestStatus: 'pending' });
  });

  it('diff-scans a pull request head without attesting it', async () => {
    const store = new MemoryStore();
    const { job } = await store.enqueueScan({
      repoUrl: 'https://github.com/o/r',
      owner: 'o',
      repo: 'r',
      ref: 'refs/pull/7/head',
      headSha: head,
      baseSha: base,
      pullRequest: 7,
      source: 'webhook',
    });
    await runOnce({ store, workerId: 'w', git: localGit }, EMPTY_INTEL);
    const done = store.scans.get(job.id)!;
    expect(done).toMatchObject({ status: 'done', verdict: 'block', attestStatus: 'none' });
    expect(done.report?.scope).toBe('diff');
  });

  it('records a generic failure when the clone fails', async () => {
    const store = new MemoryStore();
    const { job } = await store.enqueueScan({ repoUrl: 'https://github.com/o/private', owner: 'o', repo: 'private', source: 'api' });
    const failing: GitOps = { ...localGit, clone: () => Promise.reject(new Error('fatal: could not read Username')) };
    await runOnce({ store, workerId: 'w', git: failing }, EMPTY_INTEL);
    expect(store.scans.get(job.id)).toMatchObject({ status: 'failed', error: 'could not clone the repository (is it public?)' });
  });

  it('returns false on an empty queue', async () => {
    expect(await runOnce({ store: new MemoryStore(), workerId: 'w', git: localGit }, EMPTY_INTEL)).toBe(false);
  });

  it('merges registry indicators with bundled ones', async () => {
    const store = new MemoryStore();
    await store.applyEvents(
      [
        { id: '1', ledger: 1, txHash: '7'.repeat(64), contractId: 'C', closedAt: '', type: 'approve', hash: 'a'.repeat(64), curator: 'G', approvals: 2, status: 'active' },
        { id: '2', ledger: 1, txHash: '7'.repeat(64), contractId: 'C', closedAt: '', type: 'approve', hash: 'b'.repeat(64), curator: 'G', approvals: 1, status: 'proposed' },
      ],
      { name: 'registry', value: 'c' },
    );
    const intel = await loadIntel(store);
    // Only indicators the curators activated reach the scanner.
    expect(intel.hashes.has('a'.repeat(64))).toBe(true);
    expect(intel.hashes.has('b'.repeat(64))).toBe(false);
    expect(intel.packages.has('tailwindcss-style-animate')).toBe(true);
  });
});
