import { createHmac } from 'node:crypto';
import type { ScanResult } from '@dome-security/engine';
import { validateIndicator } from '@dome-security/intel';
import { Keypair } from '@dome-security/registry-client';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from './app.js';
import { ConfigError, loadConfig } from './config.js';
import { parseRepoUrl, scanForEvent } from './github.js';
import { publishPending } from './publisher.js';
import { canonicalJson, reportHash } from './report-hash.js';
import { MemoryStore } from './store/memory.js';

const SECRET = 'test-secret';
const sha = (c: string) => c.repeat(40);
const result: ScanResult = {
  tool: { name: 'dome', version: '0.1.0', rulesHash: 'f'.repeat(64) },
  target: 'https://github.com/o/r',
  scope: 'full',
  verdict: 'clean',
  findings: [],
  incomplete: [],
  stats: { filesInTree: 3, filesInScope: 3, rulesRun: 27 },
};

let store: MemoryStore;
let app: FastifyInstance;

beforeEach(async () => {
  store = new MemoryStore();
  app = await buildApp({ store, webhookSecret: SECRET, corsOrigins: ['https://dome.example'], scanRateLimitPerMinute: 3 });
});

afterEach(async () => {
  await app.close();
});

const signed = (event: string, payload: unknown, secret = SECRET) => {
  const body = JSON.stringify(payload);
  return app.inject({
    method: 'POST',
    url: '/v1/webhooks/github',
    headers: {
      'content-type': 'application/json',
      'x-github-event': event,
      'x-hub-signature-256': `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`,
    },
    payload: body,
  });
};

describe('GET /v1/scans/:id', () => {
  it('rejects ids that are not UUIDs before they reach the database', async () => {
    expect((await app.inject({ url: '/v1/scans/not-a-uuid' })).statusCode).toBe(400);
  });

  it('serializes the stored report without dropping fields, so its hash still verifies', async () => {
    const { job } = await store.enqueueScan({ repoUrl: 'https://github.com/o/r', owner: 'o', repo: 'r', source: 'api' });
    await store.claimScan('w', 60_000, 3);
    const report = { ...result, extra: { kept: true }, findings: [{ ruleId: 'DOME-VSC-001', relatedRules: [], severity: 'review', reasonKey: 'folderOpen', reason: 'R.', locations: [{ path: 'a', line: 1, future: 1 }] }] } as unknown as ScanResult;
    await store.completeScan(job.id, report, { attestable: false });
    const body = (await app.inject({ url: `/v1/scans/${job.id}` })).json();
    expect(body.report).toEqual(JSON.parse(JSON.stringify(report)));
    expect(reportHash(body.report)).toBe(body.reportHash);
  });
});

describe('POST /v1/scans', () => {
  it('queues a scan of a public GitHub repository', async () => {
    const res = await app.inject({ method: 'POST', url: '/v1/scans', payload: { url: 'https://github.com/dome-security/dome-backend' } });
    expect(res.statusCode).toBe(202);
    const { id } = res.json();
    expect(res.headers.location).toBe(`/v1/scans/${id}`);
    expect(store.scans.get(id)).toMatchObject({ owner: 'dome-security', repo: 'dome-backend', source: 'api', status: 'queued' });
  });

  it('returns the existing scan for a duplicate request', async () => {
    const first = await app.inject({ method: 'POST', url: '/v1/scans', payload: { url: 'https://github.com/o/r' } });
    const second = await app.inject({ method: 'POST', url: '/v1/scans', payload: { url: 'https://github.com/o/r.git' } });
    expect(second.statusCode).toBe(200);
    expect(second.json().id).toBe(first.json().id);
  });

  it.each([
    { url: 'https://gitlab.com/o/r' },
    { url: 'http://github.com/o/r' },
    { url: 'https://github.com/o/..' },
    { url: 'https://github.com/o/r', ref: '--upload-pack=x' },
    { url: 'https://github.com/o/r', ref: 'a/../b' },
    { url: 'https://github.com/o/r', extra: 1 },
    {},
  ])('rejects %o', async (payload) => {
    expect((await app.inject({ method: 'POST', url: '/v1/scans', payload })).statusCode).toBe(400);
  });

  it('rate limits scan requests', async () => {
    const codes = [];
    for (let i = 0; i < 4; i++) {
      codes.push((await app.inject({ method: 'POST', url: '/v1/scans', payload: { url: `https://github.com/o/r${i}` } })).statusCode);
    }
    expect(codes).toEqual([202, 202, 202, 429]);
  });
});

describe('GET /v1/scans/:id and /v1/repos', () => {
  it('returns 404 for unknown scans', async () => {
    expect((await app.inject({ url: '/v1/scans/00000000-0000-0000-0000-000000000000' })).statusCode).toBe(404);
  });

  it('includes the report and its hash once done', async () => {
    const { job } = await store.enqueueScan({ repoUrl: 'https://github.com/o/r', owner: 'o', repo: 'r', source: 'api' });
    await store.claimScan('w', 60_000, 3);
    await store.completeScan(job.id, result, { attestable: true, headSha: sha('a') });
    const body = (await app.inject({ url: `/v1/scans/${job.id}` })).json();
    expect(body).toMatchObject({ status: 'done', verdict: 'clean', commit: sha('a'), reportHash: reportHash(result) });
    const repo = (await app.inject({ url: '/v1/repos/o/r' })).json();
    expect(repo.latestScan.id).toBe(job.id);
    expect(repo.attestation).toBeNull();
  });

  it('validates repository names', async () => {
    expect((await app.inject({ url: '/v1/repos/o/r%20x' })).statusCode).toBe(400);
  });
});

const ev = (id: string) => ({ id, ledger: 5, txHash: '7'.repeat(64), contractId: 'C', closedAt: '2026-10-27T00:00:00.000Z' });

describe('indicators', () => {
  beforeEach(async () => {
    await store.applyEvents(
      [
        { ...ev('1'), type: 'propose', hash: 'b'.repeat(64), fileKind: 'font', campaign: 'demo', evidence: 'e'.repeat(64), curator: 'G1' },
        { ...ev('2'), type: 'approve', hash: 'b'.repeat(64), curator: 'G2', approvals: 2, status: 'active' },
        { ...ev('3'), type: 'approve', hash: 'c'.repeat(64), curator: 'G2', approvals: 2, status: 'active' },
        { ...ev('4'), type: 'approve', hash: 'd'.repeat(64), curator: 'G2', approvals: 1, status: 'proposed' },
      ],
      { name: 'registry', value: 'c' },
    );
  });

  it('answers hash lookups', async () => {
    const known = (await app.inject({ url: `/v1/indicators/${'B'.repeat(64)}` })).json();
    expect(known).toEqual({
      sha256: 'b'.repeat(64),
      known: true,
      campaign: 'demo',
      evidence: [`sha256:${'e'.repeat(64)}`, `stellar-tx:${'7'.repeat(64)}`],
      fileKind: 'font',
      ledger: 5,
      txHash: '7'.repeat(64),
    });
    // Proposed but not yet approved by enough curators: not known bad.
    expect((await app.inject({ url: `/v1/indicators/${'d'.repeat(64)}` })).json()).toEqual({ sha256: 'd'.repeat(64), known: false });
    expect((await app.inject({ url: `/v1/indicators/${'0'.repeat(64)}` })).json()).toEqual({ sha256: '0'.repeat(64), known: false });
    expect((await app.inject({ url: '/v1/indicators/xyz' })).statusCode).toBe(400);
  });

  it('lists active indicators in the shape dome intel update reads', async () => {
    const body = (await app.inject({ url: '/v1/indicators?limit=1' })).json();
    expect(body.indicators).toHaveLength(1);
    expect(body.nextCursor).toBeTruthy();
    const next = (await app.inject({ url: `/v1/indicators?limit=1&cursor=${body.nextCursor}` })).json();
    expect(next.indicators[0]).toMatchObject({ kind: 'hash', value: 'c'.repeat(64), campaign: 'unknown', fileKind: null });
    expect(next.nextCursor).toBeNull();
    // Every entry passes the CLI's validator, so `dome intel update` accepts the page.
    for (const i of [...body.indicators, ...next.indicators]) expect(() => validateIndicator(i)).not.toThrow();
  });
});

describe('POST /v1/webhooks/github', () => {
  const repository = { clone_url: 'https://github.com/o/r.git', private: false, default_branch: 'main' };

  it('rejects bad signatures and unconfigured secrets', async () => {
    expect((await signed('push', {}, 'wrong')).statusCode).toBe(401);
    const bare = await buildApp({ store });
    expect((await bare.inject({ method: 'POST', url: '/v1/webhooks/github', payload: {} })).statusCode).toBe(503);
    await bare.close();
  });

  it('queues a diff scan for pull requests', async () => {
    const res = await signed('pull_request', {
      action: 'synchronize',
      repository,
      pull_request: { number: 7, head: { sha: sha('a') }, base: { sha: sha('b') } },
    });
    expect(res.statusCode).toBe(202);
    expect(store.scans.get(res.json().scan)).toMatchObject({ ref: 'refs/pull/7/head', headSha: sha('a'), baseSha: sha('b'), pullRequest: 7 });
  });

  it('queues default-branch pushes and ignores everything else', async () => {
    expect((await signed('push', { ref: 'refs/heads/main', after: sha('c'), repository })).json().scan).toBeDefined();
    expect((await signed('push', { ref: 'refs/heads/feature', after: sha('c'), repository })).json().ignored).toBeDefined();
    expect((await signed('pull_request', { action: 'opened', repository: { ...repository, private: true } })).json()).toEqual({
      ignored: 'private repository',
    });
    expect((await signed('issues', { repository })).json().ignored).toBe('event');
  });
});

describe('CORS and headers', () => {
  it('allows configured origins only', async () => {
    const ok = await app.inject({ url: '/healthz', headers: { origin: 'https://dome.example' } });
    expect(ok.headers['access-control-allow-origin']).toBe('https://dome.example');
    expect(ok.headers['x-content-type-options']).toBe('nosniff');
    const other = await app.inject({ url: '/healthz', headers: { origin: 'https://evil.example' } });
    expect(other.headers['access-control-allow-origin']).toBeUndefined();
    const preflight = await app.inject({ method: 'OPTIONS', url: '/v1/scans', headers: { origin: 'https://dome.example' } });
    expect(preflight.statusCode).toBe(204);
  });
});

describe('helpers', () => {
  it('parses only GitHub repository URLs', () => {
    expect(parseRepoUrl('https://github.com/o/r.git')).toEqual({ owner: 'o', repo: 'r', repoUrl: 'https://github.com/o/r' });
    expect(parseRepoUrl('https://github.com/o/r/tree/main')).toBeUndefined();
  });

  it('ignores malformed pull request events', () => {
    expect(scanForEvent('pull_request', { action: 'opened', repository: { clone_url: 'https://github.com/o/r.git' }, pull_request: { number: 1 } }).kind).toBe('ignored');
  });

  it('hashes reports canonically', () => {
    expect(canonicalJson({ b: 1, a: [{ d: 2, c: undefined }] })).toBe('{"a":[{"d":2}],"b":1}');
    expect(reportHash({ ...result })).toBe(reportHash(JSON.parse(JSON.stringify(result)) as ScanResult));
  });

  it('validates configuration', () => {
    expect(() => loadConfig({})).toThrow(ConfigError);
    expect(() => loadConfig({ DATABASE_URL: 'postgres://x', STELLAR_RPC_URL: 'https://rpc' })).toThrow(ConfigError);
    expect(loadConfig({ DATABASE_URL: 'postgres://x', CORS_ORIGINS: 'https://a, https://b' }).corsOrigins).toEqual(['https://a', 'https://b']);
  });
});

describe('publishPending', () => {
  it('attests finished default-branch scans with the report hash', async () => {
    const { job } = await store.enqueueScan({ repoUrl: 'https://github.com/o/r', owner: 'o', repo: 'r', source: 'webhook' });
    await store.claimScan('w', 60_000, 3);
    await store.completeScan(job.id, result, { attestable: true, headSha: sha('d') });
    const calls: unknown[] = [];
    const n = await publishPending({
      store,
      signer: Keypair.random(),
      registry: {
        attest: async (_signer, attestation) => {
          calls.push(attestation);
          return 'txhash';
        },
      },
    });
    expect(n).toBe(1);
    expect(calls).toEqual([
      { owner: 'o', repo: 'r', commit: sha('d'), verdict: 'clean', scanner: 1000, rulesHash: result.tool.rulesHash, reportHash: reportHash(result) },
    ]);
    expect(store.scans.get(job.id)).toMatchObject({ attestStatus: 'published', attestTx: 'txhash' });
  });

  it('holds block results for the notice period and publishes incomplete scans as unreadable', async () => {
    const block = await store.enqueueScan({ repoUrl: 'https://github.com/o/b', owner: 'o', repo: 'b', source: 'api' });
    await store.claimScan('w', 60_000, 3);
    await store.completeScan(block.job.id, { ...result, verdict: 'block' }, { attestable: true, headSha: sha('e') });
    const incomplete = await store.enqueueScan({ repoUrl: 'https://github.com/o/i', owner: 'o', repo: 'i', source: 'api' });
    await store.claimScan('w', 60_000, 3);
    await store.completeScan(incomplete.job.id, { ...result, verdict: 'incomplete' }, { attestable: true, headSha: sha('f') });
    const verdicts: string[] = [];
    const registry = { attest: async (_s: unknown, a: { verdict: string }) => (verdicts.push(a.verdict), 'tx') };
    await publishPending({ store, signer: Keypair.random(), registry });
    expect(verdicts).toEqual(['unreadable']);
    expect(store.scans.get(block.job.id)?.attestStatus).toBe('pending');
    await publishPending({ store, signer: Keypair.random(), registry, blockHoldMs: 0 });
    expect(verdicts).toEqual(['unreadable', 'block']);
  });
});
