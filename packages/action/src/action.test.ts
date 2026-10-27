import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { COMMENT_MARKER, upsertComment, type GitHubClient } from './github.js';
import { readInputs, run, shouldFail } from './main.js';
import { command } from './workflow.js';

describe('command', () => {
  it('escapes properties and messages so file names cannot inject commands', () => {
    expect(command('error', { file: 'a,b:c\n::set-env name=X::1', line: 3 }, 'msg %\nnext')).toBe(
      '::error file=a%2Cb%3Ac%0A%3A%3Aset-env name=X%3A%3A1,line=3::msg %25%0Anext\n',
    );
  });
});

describe('inputs and gating', () => {
  it('validates inputs', () => {
    expect(readInputs({})).toMatchObject({ mode: 'enforce', failOn: 'block', scope: 'diff', sarif: false });
    expect(() => readInputs({ INPUT_MODE: 'warn' })).toThrow();
    expect(() => readInputs({ 'INPUT_PULL-REQUEST': '1; rm' })).toThrow();
  });

  it('fails on block and incomplete in enforce mode, never in report mode', () => {
    const enforce = { mode: 'enforce', failOn: 'block' } as const;
    expect(shouldFail(enforce, 'block')).toBe(true);
    expect(shouldFail(enforce, 'incomplete')).toBe(true);
    expect(shouldFail(enforce, 'review')).toBe(false);
    expect(shouldFail({ mode: 'enforce', failOn: 'review' }, 'review')).toBe(true);
    expect(shouldFail({ mode: 'report', failOn: 'review' }, 'block')).toBe(false);
  });
});

describe('upsertComment', () => {
  it('updates an existing Dome comment instead of adding another', async () => {
    const calls: string[] = [];
    const gh: GitHubClient = {
      async request<T>(method: string, p: string): Promise<T> {
        calls.push(`${method} ${p}`);
        if (method === 'GET') return [{ id: 7, body: `${COMMENT_MARKER}\nold`, user: { type: 'Bot' } }] as T;
        return {} as T;
      },
    };
    await upsertComment(gh, 'o/r', 5, 'new');
    expect(calls).toEqual(['GET /repos/o/r/issues/5/comments?per_page=100&page=1', 'PATCH /repos/o/r/issues/comments/7']);
  });

  it('ignores look-alike comments written by people', async () => {
    const calls: string[] = [];
    const gh: GitHubClient = {
      async request<T>(method: string, p: string): Promise<T> {
        calls.push(`${method} ${p}`);
        if (method === 'GET') return [{ id: 8, body: `${COMMENT_MARKER}\nfake`, user: { type: 'User' } }] as T;
        return {} as T;
      },
    };
    await upsertComment(gh, 'o/r', 5, 'new');
    expect(calls.at(-1)).toBe('POST /repos/o/r/issues/5/comments');
  });
});

describe('run', () => {
  let dir: string;
  let env: NodeJS.ProcessEnv;
  let log: string;

  const git = (...args: string[]) =>
    execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.com', '-c', 'commit.gpgsign=false', ...args], { cwd: dir })
      .toString()
      .trim();

  beforeEach(async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), 'dome-action-'));
    log = '';
    git('init', '-q', '-b', 'main');
    await writeFile(path.join(dir, 'index.js'), 'console.log(1)\n');
    git('add', '.');
    git('commit', '-q', '-m', 'base');
    const base = git('rev-parse', 'HEAD');
    await mkdir(path.join(dir, '.vscode'));
    await mkdir(path.join(dir, 'public'));
    await writeFile(path.join(dir, '.vscode/tasks.json'), JSON.stringify({ tasks: [{ command: 'node public/a.woff2', runOptions: { runOn: 'folderOpen' } }] }));
    await writeFile(path.join(dir, 'public/a.woff2'), 'DOME_FIXTURE_NOT_A_FONT');
    git('add', '.');
    git('commit', '-q', '-m', 'payload');
    const head = git('rev-parse', 'HEAD');
    const eventPath = path.join(dir, 'event.json');
    await writeFile(eventPath, JSON.stringify({ pull_request: { number: 3, head: { sha: head }, base: { sha: base } } }));
    env = {
      GITHUB_WORKSPACE: dir,
      GITHUB_REPOSITORY: 'o/r',
      GITHUB_EVENT_NAME: 'pull_request',
      GITHUB_EVENT_PATH: eventPath,
      RUNNER_TEMP: path.join(dir, 'tmp'),
      GITHUB_STEP_SUMMARY: path.join(dir, 'summary.md'),
      GITHUB_OUTPUT: path.join(dir, 'output.txt'),
    };
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('blocks a pull request that adds a disguised payload', async () => {
    const code = await run(env, { log: (t) => (log += t) });
    expect(code).toBe(1);
    expect(log).toContain('::error file=.vscode/tasks.json,line=1,col=28,title=DOME-VSC-004 + DOME-AST-001::');
    expect(await readFile(env.GITHUB_STEP_SUMMARY!, 'utf8')).toContain('Dome: merge blocked');
    expect(await readFile(env.GITHUB_OUTPUT!, 'utf8')).toMatch(/verdict<<dome_\w+\nblock\n/);
  });

  it('only reports in report mode', async () => {
    expect(await run({ ...env, INPUT_MODE: 'report' }, { log: (t) => (log += t) })).toBe(0);
  });

  it('scans a pull request by number from a workflow_run, refusing a moved head', async () => {
    const gh: GitHubClient = {
      async request<T>(): Promise<T> {
        return { number: 3, head: { sha: 'f'.repeat(40) }, base: { sha: 'e'.repeat(40), ref: 'main' } } as T;
      },
    };
    await expect(
      run({ ...env, GITHUB_EVENT_NAME: 'workflow_run', 'INPUT_PULL-REQUEST': '3', 'INPUT_EXPECTED-HEAD-SHA': 'a'.repeat(40) }, { log: () => {}, github: gh }),
    ).rejects.toThrow('head moved');
  });
});
