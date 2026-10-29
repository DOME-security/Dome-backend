import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { main } from './cli.js';
import type { Io } from './io.js';
import { parseDiffSpec } from './target.js';

let dir: string;

function io(cwd = dir): Io & { out: string; err: string } {
  const result = {
    out: '',
    err: '',
    cwd,
    env: { DOME_INTEL_CACHE: path.join(cwd, '.no-cache.json') } as NodeJS.ProcessEnv,
    isTty: false,
    stdout: (t: string) => {
      result.out += t;
    },
    stderr: (t: string) => {
      result.err += t;
    },
  };
  return result;
}

async function put(rel: string, content: string) {
  await mkdir(path.dirname(path.join(dir, rel)), { recursive: true });
  await writeFile(path.join(dir, rel), content);
}

function git(...args: string[]) {
  execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.com', '-c', 'commit.gpgsign=false', ...args], { cwd: dir });
}

const fakeFontTask = JSON.stringify({ tasks: [{ command: 'node public/fonts/fa-solid-500.woff2', runOptions: { runOn: 'folderOpen' } }] });

beforeEach(async () => {
  dir = await mkdtemp(path.join(os.tmpdir(), 'dome-cli-'));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('dome scan', () => {
  it('exits 0 for a clean folder', async () => {
    await put('index.js', 'console.log(1)');
    const t = io();
    expect(await main(['scan', '.'], t)).toBe(0);
    expect(t.out).toContain('No known pattern found is not the same as safe.');
  });

  it('ignores the target\'s own fixtures unless --trust-config is given', async () => {
    await put('.vscode/tasks.json', fakeFontTask);
    await put('public/fonts/fa-solid-500.woff2', 'DOME_FIXTURE_NOT_A_FONT');
    await put('.dome.yml', 'fixtures: ["**"]\n');
    expect(await main(['scan', '.'], io())).toBe(2);
    expect(await main(['scan', '.', '--trust-config'], io())).toBe(0);
  });

  it('exits 2 and explains a blocked payload', async () => {
    await put('.vscode/tasks.json', fakeFontTask);
    await put('public/fonts/fa-solid-500.woff2', 'DOME_FIXTURE_NOT_A_FONT');
    const t = io();
    expect(await main(['scan', '.'], t)).toBe(2);
    expect(t.out).toContain('DOME-VSC-004');
    expect(t.out).toContain('Verdict: BLOCK');
  });

  it('exits 1 for review-only findings and prints allow entries with --explain', async () => {
    await put('.vscode/tasks.json', JSON.stringify({ tasks: [{ command: 'tsc -w', runOptions: { runOn: 'folderOpen' } }] }));
    const t = io();
    expect(await main(['scan', '.', '--explain'], t)).toBe(1);
    expect(t.out).toMatch(/rule: DOME-VSC-001\n {4}file: "\.vscode\/tasks\.json"\n {4}sha256: "[0-9a-f]{64}"/);
  });

  it('writes SARIF and JSON to a file', async () => {
    await put('.vscode/settings.json', '{"task.allowAutomaticTasks":"on"}');
    const t = io();
    expect(await main(['scan', '.', '--format', 'sarif', '--output', 'dome.sarif'], t)).toBe(1);
    expect(JSON.parse(await readFile(path.join(dir, 'dome.sarif'), 'utf8')).version).toBe('2.1.0');
    expect(await main(['scan', '.', '--format', 'json'], t)).toBe(1);
    expect(JSON.parse(t.out).verdict).toBe('review');
  });

  it('scans only what a branch changes with --diff', async () => {
    git('init', '-q', '-b', 'main');
    await put('.vscode/tasks.json', JSON.stringify({ tasks: [{ command: 'tsc -w', runOptions: { runOn: 'folderOpen' } }] }));
    git('add', '.');
    git('commit', '-q', '-m', 'base');
    git('checkout', '-q', '-b', 'feature');
    await put('src/a.js', 'export const a = 1;');
    git('add', '.');
    git('commit', '-q', '-m', 'feature');
    expect(await main(['scan', '.', '--diff', 'main...HEAD'], io())).toBe(0);

    await put('public/fonts/a.woff2', 'DOME_FIXTURE_NOT_A_FONT');
    await put('.vscode/tasks.json', fakeFontTask);
    git('add', '.');
    git('commit', '-q', '-m', 'payload');
    const t = io();
    expect(await main(['scan', '.', '--diff', 'main'], t)).toBe(2);
    expect(t.out).toContain('diff scan');
  });

  it('refuses non-https URLs and bad arguments', async () => {
    const t = io();
    expect(await main(['scan', 'ext::sh -c id'], t)).toBe(64);
    expect(t.err).toContain('only https://');
    expect(await main(['scan'], io())).toBe(64);
    expect(await main(['scan', '.', '--format', 'xml'], io())).toBe(64);
    expect(await main(['scan', 'missing-dir'], io())).toBe(64);
  });
});

describe('parseDiffSpec', () => {
  it('accepts three-dot, two-dot and single refs', () => {
    expect(parseDiffSpec('origin/main...HEAD')).toEqual({ base: 'origin/main', head: 'HEAD' });
    expect(parseDiffSpec('a..b')).toEqual({ base: 'a', head: 'b' });
    expect(parseDiffSpec('main')).toEqual({ base: 'main', head: 'HEAD' });
    expect(() => parseDiffSpec('--upload-pack=x')).toThrow();
  });
});

describe('dome sweep', () => {
  it('finds repositories and reports the worst verdict', async () => {
    for (const name of ['good', 'bad']) {
      await mkdir(path.join(dir, 'code', name, '.git'), { recursive: true });
    }
    await put('code/bad/.vscode/tasks.json', fakeFontTask);
    const t = io();
    expect(await main(['sweep', 'code'], t)).toBe(2);
    expect(t.out).toContain('BLOCK      bad');
    expect(t.out).toContain('Swept 2 repositories: 1 block, 0 review, 0 could not check, 1 clean.');
  });
});

describe('dome init', () => {
  it('prints the checklist and writes files without overwriting', async () => {
    await put('.dome.yml', 'fixtures: []\n');
    const t = io();
    expect(await main(['init', '--write', '--owner', '@dome-security/maintainers'], t)).toBe(0);
    expect(t.out).toContain('Require signed commits');
    expect(t.out).toContain('skipped .dome.yml (already exists)');
    expect(await readFile(path.join(dir, '.github/workflows/dome.yml'), 'utf8')).toContain('persist-credentials: false');
    expect(await readFile(path.join(dir, '.github/CODEOWNERS'), 'utf8')).toContain('/.vscode/ @dome-security/maintainers');
  });

  it('writes a workflow that Dome itself accepts', async () => {
    await main(['init', '--write'], io());
    expect(await main(['scan', '.'], io())).toBe(0);
  });
});

describe('dome intel and misc', () => {
  it('reports intel status without a cache', async () => {
    const t = io();
    expect(await main(['intel', 'status'], t)).toBe(0);
    expect(t.out).toContain('cached:  none');
  });

  it('requires an API URL for intel update', async () => {
    expect(await main(['intel', 'update'], io())).toBe(64);
  });

  it('prints help and version, and rejects unknown commands', async () => {
    expect(await main(['--help'], io())).toBe(0);
    expect(await main(['--version'], io())).toBe(0);
    expect(await main(['frobnicate'], io())).toBe(64);
  });
});
