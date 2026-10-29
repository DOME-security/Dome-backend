import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { cleanPath, scan, TarSource, VERSION, type ScanResult, type Verdict } from '@dome-security/engine';
import { loadIntel } from '@dome-security/intel';
import { UsageError, type Io } from '../io.js';

export const SWEEP_REMOTE_HELP = `Usage: dome sweep-remote --list <file> [--out <file>] [--delay <ms>]

A private research tool. Reads each public GitHub repository in the list
(one "owner/repo" or https://github.com/owner/repo per line, "#" comments)
and scans a read-only snapshot of its default branch. Results go to a local
file with owner-only permissions and are never sent anywhere.

It only issues GET requests to api.github.com and codeload.github.com. It
never comments, opens issues, forks, stars or contacts anyone. Whether and
how to tell a maintainer is a human decision.

Options:
  --list <file>   Repositories to scan (required)
  --out <file>    Private report (default dome-sweep-remote.private.json)
  --delay <ms>    Pause between repositories (default 1000)

Set GITHUB_TOKEN (read-only, no scopes needed) for a higher rate limit.
`;

const NOTICE =
  'PRIVATE. This report names repositories that may merely resemble an attack. Do not publish it or contact maintainers on its strength: verify each finding by hand first.';
const ALLOWED_HOSTS = new Set(['api.github.com', 'codeload.github.com']);
const REPO_LINE = /^(?:https:\/\/github\.com\/)?([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9._-]{1,100}?)(?:\.git)?\/?$/;
const MAX_ARCHIVE_BYTES = 200 * 1024 * 1024;
const MAX_TAR_BYTES = 800 * 1024 * 1024;
const RANK: Record<Verdict, number> = { clean: 0, review: 1, incomplete: 2, block: 3 };

export function parseRepoList(text: string): string[] {
  const repos: string[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) return;
    const m = REPO_LINE.exec(line);
    if (!m || m[2] === '.' || m[2] === '..') throw new UsageError(`line ${i + 1} of the list is not a GitHub repository`);
    repos.push(`${m[1]}/${m[2]}`);
  });
  return [...new Set(repos)];
}

class SweepError extends Error {
  constructor(
    message: string,
    readonly stop = false,
  ) {
    super(message);
  }
}

/** The only way this command touches the network: GET, HTTPS, GitHub's read hosts, bounded redirects and size. */
async function fetchArchive(doFetch: typeof fetch, repo: string, token: string | undefined): Promise<Uint8Array> {
  let url = `https://api.github.com/repos/${repo}/tarball`;
  for (let hop = 0; hop < 3; hop++) {
    const target = new URL(url);
    if (target.protocol !== 'https:' || !ALLOWED_HOSTS.has(target.hostname)) throw new SweepError('redirected outside GitHub');
    const headers: Record<string, string> = { 'user-agent': `dome-sweep-remote/${VERSION}`, accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28' };
    if (token && target.hostname === 'api.github.com') headers.authorization = `Bearer ${token}`;
    const res = await doFetch(url, { method: 'GET', headers, redirect: 'manual' });
    if (res.status >= 300 && res.status < 400) {
      const next = res.headers.get('location');
      if (!next) throw new SweepError('unexpected redirect');
      url = new URL(next, url).toString();
      continue;
    }
    if (res.status === 429 || (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0')) throw new SweepError('rate limited', true);
    if (res.status === 404 || res.status === 403 || res.status === 451) throw new SweepError('not available (missing, private or blocked)');
    if (!res.ok || !res.body) throw new SweepError(`GitHub answered ${res.status}`);
    const chunks: Uint8Array[] = [];
    let total = 0;
    for await (const chunk of res.body as unknown as AsyncIterable<Uint8Array>) {
      total += chunk.length;
      if (total > MAX_ARCHIVE_BYTES) throw new SweepError('archive too large');
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
  throw new SweepError('too many redirects');
}

interface RepoReport {
  repo: string;
  status: 'scanned' | 'error' | 'skipped';
  commit?: string;
  verdict?: Verdict;
  result?: ScanResult;
  error?: string;
}

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runSweepRemote(args: string[], io: Io): Promise<number> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      list: { type: 'string' },
      out: { type: 'string', default: 'dome-sweep-remote.private.json' },
      delay: { type: 'string', default: '1000' },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });
  if (values.help) {
    io.stdout(SWEEP_REMOTE_HELP);
    return 0;
  }
  if (!values.list || positionals.length > 0) throw new UsageError('dome sweep-remote needs --list <file>');
  const delay = Number(values.delay);
  if (!Number.isInteger(delay) || delay < 0 || delay > 60_000) throw new UsageError('--delay must be between 0 and 60000');

  const repos = parseRepoList(await readFile(path.resolve(io.cwd, values.list), 'utf8'));
  if (repos.length === 0) throw new UsageError('the list has no repositories');
  const intel = await loadIntel();
  const doFetch = io.fetch ?? fetch;
  const token = io.env.GITHUB_TOKEN || undefined;

  const reports: RepoReport[] = [];
  let stopped = false;
  for (const [i, repo] of repos.entries()) {
    if (stopped) {
      reports.push({ repo, status: 'skipped', error: 'stopped after the rate limit' });
      continue;
    }
    if (i > 0 && delay > 0) await pause(delay);
    try {
      const source = TarSource.fromGzip(await fetchArchive(doFetch, repo, token), `https://github.com/${repo}`, MAX_TAR_BYTES);
      // Snapshots of other people's repositories are untrusted, including their .dome.yml.
      const result = await scan({ source, intel, repoConfig: 'untrusted' });
      reports.push({ repo, status: 'scanned', commit: source.commit, verdict: result.verdict, result });
    } catch (error) {
      const stop = error instanceof SweepError && error.stop;
      stopped ||= stop;
      reports.push({ repo, status: 'error', error: error instanceof SweepError ? error.message : 'archive could not be read' });
    }
  }

  const out = path.resolve(io.cwd, values.out);
  const body = { private: true, notice: NOTICE, tool: { name: 'dome', version: VERSION }, generatedAt: new Date().toISOString(), repositories: reports };
  await writeFile(out, `${JSON.stringify(body, null, 2)}\n`, { mode: 0o600 });

  const counts = { block: 0, review: 0, incomplete: 0, clean: 0, error: 0 };
  let worst: Verdict = 'clean';
  for (const r of reports) {
    if (r.verdict) {
      counts[r.verdict]++;
      if (RANK[r.verdict] > RANK[worst]) worst = r.verdict;
    } else {
      counts.error++;
    }
  }
  io.stdout(
    `Scanned ${repos.length} repositories: ${counts.block} block, ${counts.review} review, ${counts.incomplete} could not check, ${counts.clean} clean, ${counts.error} not scanned.\n` +
      `Private report written to ${cleanPath(path.relative(io.cwd, out) || out)} (owner-only permissions). Nothing was posted or sent.\n`,
  );
  if (counts.error > 0) return 3;
  return { clean: 0, review: 1, block: 2, incomplete: 3 }[worst];
}
