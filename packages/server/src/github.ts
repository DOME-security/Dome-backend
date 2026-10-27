import { createHmac, timingSafeEqual } from 'node:crypto';
import type { NewScan } from './store/types.js';

/** Verifies `X-Hub-Signature-256` over the raw request body in constant time. */
export function verifySignature(secret: string, body: Buffer, header: string | undefined): boolean {
  if (!header?.startsWith('sha256=')) return false;
  const expected = Buffer.from(`sha256=${createHmac('sha256', secret).update(body).digest('hex')}`);
  const given = Buffer.from(header);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

const REPO_URL = /^https:\/\/github\.com\/([A-Za-z0-9-]{1,39})\/([A-Za-z0-9._-]{1,100}?)(?:\.git)?\/?$/;

/** Parses a public GitHub repository URL. Other hosts are not accepted. */
export function parseRepoUrl(url: string): { owner: string; repo: string; repoUrl: string } | undefined {
  const m = REPO_URL.exec(url);
  if (!m || m[2] === '.' || m[2] === '..') return undefined;
  return { owner: m[1]!, repo: m[2]!, repoUrl: `https://github.com/${m[1]}/${m[2]}` };
}

const SHA = /^[0-9a-f]{40}$/;
const PR_ACTIONS = new Set(['opened', 'synchronize', 'reopened', 'ready_for_review']);

interface Repository {
  clone_url?: string;
  private?: boolean;
  default_branch?: string;
}

interface WebhookPayload {
  action?: string;
  repository?: Repository;
  pull_request?: { number?: number; head?: { sha?: string }; base?: { sha?: string } };
  ref?: string;
  after?: string;
  deleted?: boolean;
}

export type WebhookOutcome = { kind: 'scan'; scan: NewScan } | { kind: 'ignored'; reason: string };

/**
 * Turns a GitHub App delivery into a scan job. Private repositories are
 * skipped: workers hold no credentials.
 */
export function scanForEvent(event: string, payload: WebhookPayload): WebhookOutcome {
  const repository = payload.repository;
  const parsed = repository?.clone_url ? parseRepoUrl(repository.clone_url) : undefined;
  if (event === 'ping') return { kind: 'ignored', reason: 'ping' };
  if (!parsed) return { kind: 'ignored', reason: 'unsupported repository' };
  if (repository?.private) return { kind: 'ignored', reason: 'private repository' };

  if (event === 'pull_request') {
    const pr = payload.pull_request;
    if (!payload.action || !PR_ACTIONS.has(payload.action)) return { kind: 'ignored', reason: 'pull request action' };
    if (!pr?.number || !SHA.test(pr.head?.sha ?? '') || !SHA.test(pr.base?.sha ?? '')) return { kind: 'ignored', reason: 'malformed pull request' };
    return {
      kind: 'scan',
      scan: {
        ...parsed,
        ref: `refs/pull/${pr.number}/head`,
        headSha: pr.head!.sha!,
        baseSha: pr.base!.sha!,
        pullRequest: pr.number,
        source: 'webhook',
      },
    };
  }
  if (event === 'push') {
    const branch = repository?.default_branch;
    if (!branch || payload.ref !== `refs/heads/${branch}` || payload.deleted || !SHA.test(payload.after ?? '')) {
      return { kind: 'ignored', reason: 'not a default-branch push' };
    }
    return { kind: 'scan', scan: { ...parsed, ref: branch, headSha: payload.after!, source: 'webhook' } };
  }
  return { kind: 'ignored', reason: 'event' };
}
