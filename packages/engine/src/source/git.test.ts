import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { FsSource } from './fs.js';
import { GitTreeSource, gitChangedPaths, isCloneableUrl } from './git.js';

let dir: string;

function git(...args: string[]) {
  execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.com', '-c', 'commit.gpgsign=false', ...args], {
    cwd: dir,
  });
}

beforeAll(async () => {
  dir = await mkdtemp(path.join(os.tmpdir(), 'dome-git-test-'));
  git('init', '-q', '-b', 'main');
  await writeFile(path.join(dir, 'a.txt'), 'first\n');
  await mkdir(path.join(dir, 'sub'));
  await writeFile(path.join(dir, 'sub', 'b.bin'), Buffer.from([0, 1, 2, 10, 255]));
  git('add', '.');
  git('commit', '-q', '-m', 'one');
  git('checkout', '-q', '-b', 'feature');
  await writeFile(path.join(dir, 'c.txt'), 'added\n');
  await writeFile(path.join(dir, 'a.txt'), 'changed\n');
  await symlink('/etc/passwd', path.join(dir, 'link'));
  git('add', '.');
  git('commit', '-q', '-m', 'two');
});

afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('GitTreeSource', () => {
  it('lists the tree at a revision without a checkout', async () => {
    const source = new GitTreeSource(dir, 'main');
    const entries = await source.list();
    expect(entries.map((e) => e.path).sort()).toEqual(['a.txt', 'sub/b.bin']);
    await source.close();
  });

  it('reads binary blobs exactly, including newlines and high bytes', async () => {
    const source = new GitTreeSource(dir, 'main');
    expect(await source.read('sub/b.bin')).toEqual(new Uint8Array([0, 1, 2, 10, 255]));
    expect(new TextDecoder().decode(await source.read('a.txt'))).toBe('first\n');
    await source.close();
  });

  it('reports symlinks without reading their target', async () => {
    const source = new GitTreeSource(dir, 'feature');
    const link = (await source.list()).find((e) => e.path === 'link');
    expect(link?.kind).toBe('symlink');
    expect(await source.read('link')).toBeUndefined();
    await source.close();
  });

  it('returns undefined for paths not in the tree', async () => {
    const source = new GitTreeSource(dir, 'main');
    expect(await source.read('nope.txt')).toBeUndefined();
    await source.close();
  });
});

describe('gitChangedPaths', () => {
  it('lists files a branch changes against its merge base', async () => {
    expect((await gitChangedPaths(dir, 'main', 'feature')).sort()).toEqual(['a.txt', 'c.txt', 'link']);
  });
});

describe('FsSource', () => {
  it('walks files, skips .git and never follows symlinks', async () => {
    const source = new FsSource(dir);
    const entries = await source.list();
    expect(entries.map((e) => e.path).sort()).toEqual(['a.txt', 'c.txt', 'link', 'sub/b.bin']);
    expect(entries.find((e) => e.path === 'link')?.kind).toBe('symlink');
    expect(await source.read('link')).toBeUndefined();
  });
});

describe('isCloneableUrl', () => {
  it('accepts only plain https URLs', () => {
    expect(isCloneableUrl('https://github.com/owner/repo')).toBe(true);
    expect(isCloneableUrl('https://github.com/owner/repo.git')).toBe(true);
    expect(isCloneableUrl('ext::sh -c touch% /tmp/pwned')).toBe(false);
    expect(isCloneableUrl('file:///etc')).toBe(false);
    expect(isCloneableUrl('git@github.com:owner/repo.git')).toBe(false);
    expect(isCloneableUrl('https://github.com/owner/../repo')).toBe(false);
    expect(isCloneableUrl('-uhttps://github.com/owner/repo')).toBe(false);
  });
});
