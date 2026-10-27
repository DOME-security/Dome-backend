import { randomUUID } from 'node:crypto';
import type { ScanResult } from '@dome-security/engine';
import type { ApproveEvent, AttestEvent, RevokeEvent } from '@dome-security/registry-client';
import {
  decodeCursor,
  encodeCursor,
  type AttestationRecord,
  type IndicatorRecord,
  type NewScan,
  type Page,
  type ScanJob,
  type Store,
} from './types.js';

type IndicatorRow = IndicatorRecord & { eventId: string };

/** An in-process store with the same semantics as PgStore. For tests and local experiments. */
export class MemoryStore implements Store {
  readonly scans = new Map<string, ScanJob>();
  private readonly indicators = new Map<string, IndicatorRow>();
  private readonly attestations = new Map<string, AttestationRecord & { eventId: string }>();
  private readonly cursors = new Map<string, string>();
  now: () => Date = () => new Date();

  async enqueueScan(input: NewScan) {
    const existing = [...this.scans.values()].find(
      (s) =>
        (s.status === 'queued' || s.status === 'running') &&
        s.owner === input.owner &&
        s.repo === input.repo &&
        s.headSha === (input.headSha ?? null) &&
        s.ref === (input.ref ?? null),
    );
    if (existing) return { job: existing, created: false };
    const job: ScanJob = {
      id: randomUUID(),
      repoUrl: input.repoUrl,
      owner: input.owner,
      repo: input.repo,
      ref: input.ref ?? null,
      headSha: input.headSha ?? null,
      baseSha: input.baseSha ?? null,
      pullRequest: input.pullRequest ?? null,
      source: input.source,
      status: 'queued',
      verdict: null,
      report: null,
      error: null,
      attempts: 0,
      attestStatus: 'none',
      attestTx: null,
      createdAt: this.now().toISOString(),
      startedAt: null,
      finishedAt: null,
    };
    this.scans.set(job.id, job);
    return { job, created: true };
  }

  async getScan(id: string) {
    return this.scans.get(id);
  }

  async latestScan(owner: string, repo: string) {
    return [...this.scans.values()]
      .filter((s) => s.owner === owner && s.repo === repo)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  }

  async claimScan(_workerId: string, staleAfterMs: number, maxAttempts: number) {
    const now = this.now().getTime();
    const stale = (s: ScanJob) => s.status === 'running' && s.startedAt !== null && now - Date.parse(s.startedAt) > staleAfterMs;
    for (const s of this.scans.values()) {
      if (stale(s) && s.attempts >= maxAttempts) Object.assign(s, { status: 'failed', error: 'worker timed out', finishedAt: this.now().toISOString() });
    }
    const next = [...this.scans.values()]
      .filter((s) => s.status === 'queued' || stale(s))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0];
    if (!next) return undefined;
    Object.assign(next, { status: 'running', startedAt: this.now().toISOString(), attempts: next.attempts + 1 });
    return { ...next };
  }

  async completeScan(id: string, result: ScanResult, { attestable, headSha }: { attestable: boolean; headSha?: string }) {
    const s = this.scans.get(id);
    if (!s) return;
    Object.assign(s, {
      status: 'done',
      verdict: result.verdict,
      report: result,
      headSha: headSha ?? s.headSha,
      finishedAt: this.now().toISOString(),
      attestStatus: attestable && result.verdict !== 'incomplete' ? 'pending' : 'none',
    });
  }

  async failScan(id: string, error: string) {
    const s = this.scans.get(id);
    if (s) Object.assign(s, { status: 'failed', error, finishedAt: this.now().toISOString() });
  }

  async pendingAttestations(limit: number) {
    return [...this.scans.values()].filter((s) => s.attestStatus === 'pending').slice(0, limit);
  }

  async markAttested(id: string, outcome: { tx: string } | { error: string }) {
    const s = this.scans.get(id);
    if (!s) return;
    if ('tx' in outcome) Object.assign(s, { attestStatus: 'published', attestTx: outcome.tx });
    else Object.assign(s, { attestStatus: 'failed', error: outcome.error });
  }

  async getIndicator(kind: IndicatorRecord['kind'], value: string) {
    const row = this.indicators.get(`${kind}\0${value}`);
    if (!row) return undefined;
    const { eventId: _eventId, ...record } = row;
    return record;
  }

  async listIndicators(cursor: string | null, limit: number): Promise<Page<IndicatorRecord>> {
    const after = cursor ? decodeCursor(cursor) : undefined;
    const rows = [...this.indicators.values()]
      .filter((r) => r.active)
      .sort((a, b) => a.kind.localeCompare(b.kind) || a.value.localeCompare(b.value))
      .filter((r) => !after || r.kind > after[0] || (r.kind === after[0] && r.value > after[1]));
    const items = rows.slice(0, limit).map(({ eventId: _e, ...r }) => r);
    const last = items.at(-1);
    return { items, nextCursor: rows.length > limit && last ? encodeCursor(last.kind, last.value) : null };
  }

  async latestAttestation(owner: string, repo: string) {
    const rows = [...this.attestations.values()].filter((a) => a.owner === owner && a.repo === repo);
    const latest = rows.sort((a, b) => b.eventId.localeCompare(a.eventId))[0];
    if (!latest) return undefined;
    const { eventId: _e, ...record } = latest;
    return record;
  }

  async applyEvents(events: (AttestEvent | ApproveEvent | RevokeEvent)[], cursor: { name: string; value: string }) {
    for (const e of events) {
      if (e.type === 'attest') {
        const [owner, repo] = e.repo.split('/') as [string, string];
        this.attestations.set(e.id, {
          eventId: e.id,
          owner,
          repo,
          commit: e.commit,
          verdict: e.verdict,
          reportHash: e.reportHash,
          attester: e.attester,
          ledger: e.ledger,
          txHash: e.txHash,
          closedAt: e.closedAt,
        });
        continue;
      }
      const key = `${e.kind}\0${e.value}`;
      const current = this.indicators.get(key);
      if (current && current.eventId >= e.id) continue;
      this.indicators.set(key, {
        kind: e.kind,
        value: e.value,
        campaign: e.type === 'approve' ? e.campaign : (current?.campaign ?? ''),
        evidence: e.type === 'approve' ? e.evidence : (current?.evidence ?? []),
        active: e.type === 'approve',
        ledger: e.ledger,
        txHash: e.txHash,
        eventId: e.id,
      });
    }
    this.cursors.set(cursor.name, cursor.value);
  }

  async getCursor(name: string) {
    return this.cursors.get(name);
  }

  async close() {}
}
