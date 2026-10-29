import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  fetchCommit,
  formatJson,
  formatMarkdown,
  formatSarif,
  gitChangedPaths,
  gitMergeBase,
  GitTreeSource,
  ruleLabel,
  scan,
  type FileSource,
  type ScanResult,
} from '@dome-security/engine';
import { bundledIndicators, toIntelSet } from '@dome-security/intel';
import { createClient, getPullRequest, GitHubError, uploadSarif, upsertComment, type GitHubClient } from './github.js';
import { appendSummary, booleanInput, command, input, setOutput } from './workflow.js';

const ZERO_SHA = /^0+$/;

export interface ActionDeps {
  /** Writes to the job log (stdout). */
  log(text: string): void;
  github?: GitHubClient;
}

interface Inputs {
  mode: 'enforce' | 'report';
  failOn: 'block' | 'review';
  scope: 'diff' | 'full';
  sarif: boolean;
  comment: boolean;
  pullRequest: number | undefined;
  expectedHeadSha: string;
  token: string;
}

export function readInputs(env: NodeJS.ProcessEnv): Inputs {
  const mode = input(env, 'mode', 'enforce');
  const failOn = input(env, 'fail-on', 'block');
  const scope = input(env, 'scope', 'diff');
  if (mode !== 'enforce' && mode !== 'report') throw new Error('input mode must be "enforce" or "report"');
  if (failOn !== 'block' && failOn !== 'review') throw new Error('input fail-on must be "block" or "review"');
  if (scope !== 'diff' && scope !== 'full') throw new Error('input scope must be "diff" or "full"');
  const pr = input(env, 'pull-request');
  if (pr && !/^[1-9]\d*$/.test(pr)) throw new Error('input pull-request must be a pull request number');
  const expectedHeadSha = input(env, 'expected-head-sha');
  if (expectedHeadSha && !/^[0-9a-f]{40}$/.test(expectedHeadSha)) throw new Error('input expected-head-sha must be a full commit SHA');
  return {
    mode,
    failOn,
    scope,
    sarif: booleanInput(env, 'sarif'),
    comment: booleanInput(env, 'comment'),
    pullRequest: pr ? Number(pr) : undefined,
    expectedHeadSha,
    token: input(env, 'token'),
  };
}

interface Target {
  head: string;
  /** Commit to diff against; undefined means a full scan. */
  base: string | undefined;
  pullRequest: number | undefined;
  ref: string | undefined;
}

interface ActionEvent {
  pull_request?: { number: number; head: { sha: string }; base: { sha: string } };
  before?: unknown;
  after?: unknown;
}

async function resolveTarget(env: NodeJS.ProcessEnv, inputs: Inputs, workspace: string, gh: () => GitHubClient): Promise<Target> {
  const repo = env.GITHUB_REPOSITORY ?? '';
  if (inputs.pullRequest !== undefined) {
    const pr = await getPullRequest(gh(), repo, inputs.pullRequest);
    if (inputs.expectedHeadSha && pr.head.sha !== inputs.expectedHeadSha) {
      throw new Error('the pull request head moved since the triggering run; not scanning a different commit');
    }
    // Objects only: nothing from the pull request is checked out.
    await fetchCommit(workspace, `refs/pull/${pr.number}/head`);
    await fetchCommit(workspace, pr.base.sha);
    return { head: pr.head.sha, base: pr.base.sha, pullRequest: pr.number, ref: `refs/pull/${pr.number}/head` };
  }
  const event = env.GITHUB_EVENT_PATH ? (JSON.parse(await readFile(env.GITHUB_EVENT_PATH, 'utf8')) as ActionEvent) : {};
  if (env.GITHUB_EVENT_NAME === 'pull_request' && event.pull_request) {
    return {
      head: event.pull_request.head.sha,
      base: event.pull_request.base.sha,
      pullRequest: event.pull_request.number,
      ref: env.GITHUB_REF,
    };
  }
  if (env.GITHUB_EVENT_NAME === 'push' && typeof event.after === 'string') {
    const before = typeof event.before === 'string' && !ZERO_SHA.test(event.before) ? event.before : undefined;
    return { head: event.after, base: before, pullRequest: undefined, ref: env.GITHUB_REF };
  }
  return { head: env.GITHUB_SHA || 'HEAD', base: undefined, pullRequest: undefined, ref: env.GITHUB_REF };
}

function annotate(result: ScanResult, log: (t: string) => void): void {
  for (const f of result.findings) {
    if (f.fixture || f.allowed || f.severity === 'info') continue;
    const loc = f.locations[0];
    const title = ruleLabel(f);
    log(command(f.severity === 'block' ? 'error' : 'warning', { file: loc?.path, line: loc?.line, col: loc?.column, title }, f.reason));
  }
  for (const i of result.incomplete) {
    log(command('warning', { file: i.path, title: 'Dome could not check this file' }, `Not checked (${i.reason}).`));
  }
}

export function shouldFail(inputs: Pick<Inputs, 'mode' | 'failOn'>, verdict: ScanResult['verdict']): boolean {
  if (inputs.mode === 'report') return false;
  if (verdict === 'block' || verdict === 'incomplete') return true;
  return inputs.failOn === 'review' && verdict === 'review';
}

/** Runs the action and returns the process exit code. */
export async function run(env: NodeJS.ProcessEnv, deps: ActionDeps): Promise<number> {
  const inputs = readInputs(env);
  const workspace = env.GITHUB_WORKSPACE ?? process.cwd();
  const repo = env.GITHUB_REPOSITORY ?? '';
  let client = deps.github;
  const gh = () => (client ??= createClient(inputs.token, env.GITHUB_API_URL));

  const target = await resolveTarget(env, inputs, workspace, gh);
  const source: FileSource = new GitTreeSource(workspace, target.head, repo || workspace);
  let diff: { base: FileSource; changed: string[] } | undefined;
  if (inputs.scope === 'diff' && target.base) {
    try {
      const mergeBase = await gitMergeBase(workspace, target.base, target.head);
      diff = { base: new GitTreeSource(workspace, mergeBase), changed: await gitChangedPaths(workspace, mergeBase, target.head) };
    } catch {
      throw new Error('could not find the base commit; check out with fetch-depth: 0');
    }
  }

  // In a diff scan .dome.yml comes from the base commit, and a full scan reads
  // the pushed branch itself, so the maintainers' own file is trusted.
  const result = await scan({ source, diff, intel: toIntelSet(bundledIndicators()), repoConfig: 'trusted' });
  const markdown = formatMarkdown(result);
  const sarif = formatSarif(result);

  const outDir = path.join(env.RUNNER_TEMP ?? workspace, 'dome');
  await mkdir(outDir, { recursive: true });
  const files = { json: path.join(outDir, 'report.json'), markdown: path.join(outDir, 'report.md'), sarif: path.join(outDir, 'report.sarif') };
  await Promise.all([writeFile(files.json, formatJson(result)), writeFile(files.markdown, markdown), writeFile(files.sarif, sarif)]);
  setOutput(env, 'verdict', result.verdict);
  setOutput(env, 'report-json', files.json);
  setOutput(env, 'report-markdown', files.markdown);
  setOutput(env, 'report-sarif', files.sarif);

  annotate(result, deps.log);
  appendSummary(env, markdown);

  if (inputs.sarif) {
    try {
      await uploadSarif(gh(), repo, sarif, target.head, target.ref ?? 'refs/heads/main');
    } catch (error) {
      const hint = error instanceof GitHubError && error.status === 403 ? ' (the job needs security-events: write)' : '';
      deps.log(command('warning', {}, `SARIF upload failed${hint}.`));
    }
  }
  if (inputs.comment && target.pullRequest !== undefined) {
    try {
      await upsertComment(gh(), repo, target.pullRequest, markdown);
    } catch (error) {
      const hint = error instanceof GitHubError && error.status === 403 ? ' (fork pull requests get a read-only token; use the workflow_run example)' : '';
      deps.log(command('warning', {}, `Could not comment on the pull request${hint}.`));
    }
  }

  deps.log(`Dome verdict: ${result.verdict} (${result.findings.length} findings, ${result.stats.filesInScope} files in scope)\n`);
  if (shouldFail(inputs, result.verdict)) {
    deps.log(command('error', {}, `Dome: ${result.verdict === 'incomplete' ? 'could not check every file' : `verdict is ${result.verdict}`}.`));
    return 1;
  }
  return 0;
}

const isEntry = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isEntry) {
  run(process.env, { log: (t) => process.stdout.write(t) }).then(
    (code) => {
      process.exitCode = code;
    },
    (error: unknown) => {
      process.stdout.write(command('error', {}, `Dome failed: ${(error as Error).message}`));
      process.exitCode = 1;
    },
  );
}
