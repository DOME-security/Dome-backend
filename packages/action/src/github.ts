import { gzipSync } from 'node:zlib';

export interface GitHubClient {
  request<T>(method: string, path: string, body?: unknown): Promise<T>;
}

export class GitHubError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'GitHubError';
  }
}

export function createClient(token: string, apiUrl = 'https://api.github.com', fetchImpl: typeof fetch = fetch): GitHubClient {
  return {
    async request<T>(method: string, path: string, body?: unknown): Promise<T> {
      const res = await fetchImpl(`${apiUrl}${path}`, {
        method,
        headers: {
          accept: 'application/vnd.github+json',
          authorization: `Bearer ${token}`,
          'x-github-api-version': '2022-11-28',
          'user-agent': 'dome-action',
          ...(body === undefined ? {} : { 'content-type': 'application/json' }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) throw new GitHubError(res.status, `GitHub API ${method} ${path.split('?')[0]} failed with HTTP ${res.status}`);
      return (res.status === 204 ? undefined : await res.json()) as T;
    },
  };
}

export interface PullRequestInfo {
  number: number;
  head: { sha: string };
  base: { sha: string; ref: string };
}

export function getPullRequest(gh: GitHubClient, repo: string, number: number): Promise<PullRequestInfo> {
  return gh.request('GET', `/repos/${repo}/pulls/${number}`);
}

export async function uploadSarif(gh: GitHubClient, repo: string, sarif: string, commitSha: string, ref: string): Promise<void> {
  await gh.request('POST', `/repos/${repo}/code-scanning/sarifs`, {
    commit_sha: commitSha,
    ref,
    sarif: gzipSync(Buffer.from(sarif)).toString('base64'),
    tool_name: 'Dome',
  });
}

export const COMMENT_MARKER = '<!-- dome-security:report -->';

interface IssueComment {
  id: number;
  body?: string;
  user?: { login?: string; type?: string };
}

/** Creates the Dome comment on a pull request, or updates the one Dome posted before. */
export async function upsertComment(gh: GitHubClient, repo: string, number: number, markdown: string): Promise<void> {
  const body = `${COMMENT_MARKER}\n${markdown}`;
  for (let page = 1; page <= 10; page++) {
    const comments = await gh.request<IssueComment[]>('GET', `/repos/${repo}/issues/${number}/comments?per_page=100&page=${page}`);
    const mine = comments.find((c) => c.user?.type === 'Bot' && c.body?.startsWith(COMMENT_MARKER));
    if (mine) {
      await gh.request('PATCH', `/repos/${repo}/issues/comments/${mine.id}`, { body });
      return;
    }
    if (comments.length < 100) break;
  }
  await gh.request('POST', `/repos/${repo}/issues/${number}/comments`, { body });
}
