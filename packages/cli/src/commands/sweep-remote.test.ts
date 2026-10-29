import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { main } from '../cli.js';
import type { Io } from '../io.js';
import { parseRepoList } from './sweep-remote.js';

function tarball(files: Record<string, string>): Buffer {
  const blocks: Buffer[] = [];
  for (const [name, text] of Object.entries(files)) {
    const data = Buffer.from(text);
    const h = Buffer.alloc(512);
    h.write(`o-r-abc/${name}`, 0);
    h.write(`${data.length.toString(8).padStart(11, '0')}\0`, 124);
    h.write('0', 156);
    blocks.push(h, data, Buffer.alloc((512 - (data.length % 512)) % 512));
  }
  blocks.push(Buffer.alloc(1024));
  return gzipSync(Buffer.concat(blocks));
}

const TASK = JSON.stringify({ tasks: [{ command: 'node public/fonts/a.woff2', runOptions: { runOn: 'folderOpen' } }] });
const BAD = tarball({ '.vscode/tasks.json': TASK, 'public/fonts/a.woff2': 'DOME_FIXTURE_NOT_A_FONT' });
const GOOD = tarball({ 'README.md': 'hello' });

let dir: string;
let requests: { url: string; method: string; body: unknown; auth: string | null }[];

beforeEach(async () => {
  dir = await mkdtemp(path.join(os.tmpdir(), 'dome-sweep-remote-'));
  requests = [];
});
afterEach(() => rm(dir, { recursive: true, force: true }));

function io(handler: (url: URL) => Response, env: Record<string, string> = {}): Io & { out: string } {
  const result = {
    out: '',
    cwd: dir,
    env: { DOME_INTEL_CACHE: path.join(dir, '.none.json'), ...env } as NodeJS.ProcessEnv,
    isTty: false,
    stdout: (t: string) => {
      result.out += t;
    },
    stderr: () => {},
    fetch: (async (input: string | URL | Request, init?: RequestInit) => {
      const url = new URL(String(input));
      const headers = new Headers(init?.headers);
      requests.push({ url: url.toString(), method: init?.method ?? 'GET', body: init?.body, auth: headers.get('authorization') });
      return handler(url);
    }) as typeof fetch,
  };
  return result;
}

const archive = (body: Buffer) => new Response(new Uint8Array(body), { status: 200 });
const redirectTo = (location: string) => new Response(null, { status: 302, headers: { location } });

describe('dome sweep-remote', () => {
  it('parses a list of repositories and rejects anything else', () => {
    expect(parseRepoList('# mine\nfoo/bar\nhttps://github.com/baz/qux.git  # note\n\nfoo/bar\n')).toEqual(['foo/bar', 'baz/qux']);
    for (const bad of ['https://evil.example/foo/bar', 'foo', 'foo/bar/baz', '../x/y', 'a/..']) {
      expect(() => parseRepoList(bad), bad).toThrow();
    }
  });

  it('scans snapshots, writes a private report, and only ever GETs GitHub', async () => {
    await writeFile(path.join(dir, 'list.txt'), 'o/bad\no/good\n');
    const t = io((url) => (url.hostname === 'api.github.com' ? redirectTo(`https://codeload.github.com/${url.pathname}`) : archive(url.pathname.includes('bad') ? BAD : GOOD)), { GITHUB_TOKEN: 'ghp_FIXTURE' });
    expect(await main(['sweep-remote', '--list', 'list.txt', '--delay', '0'], t)).toBe(2);
    expect(t.out).toContain('1 block');
    expect(t.out).toContain('Nothing was posted or sent.');

    expect(requests.length).toBe(4);
    for (const r of requests) {
      expect(r.method).toBe('GET');
      expect(r.body).toBeUndefined();
      expect(['api.github.com', 'codeload.github.com']).toContain(new URL(r.url).hostname);
    }
    // The token goes only to the API host, never to the redirect target.
    expect(requests.filter((r) => r.auth).every((r) => new URL(r.url).hostname === 'api.github.com')).toBe(true);

    const file = path.join(dir, 'dome-sweep-remote.private.json');
    expect((await stat(file)).mode & 0o777).toBe(0o600);
    const report = JSON.parse(await readFile(file, 'utf8'));
    expect(report.private).toBe(true);
    expect(report.repositories.map((r: { repo: string; verdict: string }) => [r.repo, r.verdict])).toEqual([['o/bad', 'block'], ['o/good', 'clean']]);
    expect(JSON.stringify(report)).not.toContain('ghp_FIXTURE');
  });

  it('refuses to follow a redirect away from GitHub', async () => {
    await writeFile(path.join(dir, 'list.txt'), 'o/r\n');
    const t = io(() => redirectTo('https://attacker.example/x.tgz'));
    expect(await main(['sweep-remote', '--list', 'list.txt', '--delay', '0'], t)).toBe(3);
    expect(requests.map((r) => new URL(r.url).hostname)).toEqual(['api.github.com']);
    const report = JSON.parse(await readFile(path.join(dir, 'dome-sweep-remote.private.json'), 'utf8'));
    expect(report.repositories[0]).toMatchObject({ status: 'error', error: 'redirected outside GitHub' });
  });

  it('reports a missing repository as not scanned, never as clean, and stops at the rate limit', async () => {
    await writeFile(path.join(dir, 'list.txt'), 'o/gone\no/limited\no/after\n');
    const t = io((url) => new Response(null, { status: url.pathname.includes('gone') ? 404 : 429 }));
    expect(await main(['sweep-remote', '--list', 'list.txt', '--delay', '0', '--out', 'r.private.json'], t)).toBe(3);
    const report = JSON.parse(await readFile(path.join(dir, 'r.private.json'), 'utf8'));
    expect(report.repositories.map((r: { status: string }) => r.status)).toEqual(['error', 'error', 'skipped']);
    expect(requests).toHaveLength(2);
  });

  it('needs a list', async () => {
    expect(await main(['sweep-remote'], io(() => archive(GOOD)))).toBe(64);
  });
});
