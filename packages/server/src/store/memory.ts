import { randomUUID } from 'node:crypto';
import type { ScanResult } from '@dome-security/engine';
import {
  decodeCursor,
  encodeCursor,
  type AttestationRecord,
  type IndexedEvent,
  type IndicatorRecord,
  type NewScan,
  type Page,
  type ScanJob,
  type Store,
} from './types.js';

/** `metaEventId` guards the proposal's fields, `statusEventId` the status, so replays change nothing. */
type IndicatorRow = IndicatorRecord & { metaEventId: string | null; statusEventId: string };

/** An in-process store with the same semantics as PgStore. For tests and local experiments. */
export class MemoryStore implements Store {
  readonly scans = new Map<string, ScanJob>();
  private readonly indicators = new Map<string, IndicatorRow>();
  private readonly attestations = new Map<string, AttestationRecord>();
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
      attestStatus: attestable ? 'pending' : 'none',
    });
  }

  async failScan(id: string, error: string) {
    const s = this.scans.get(id);
    if (s) Object.assign(s, { status: 'failed', error, finishedAt: this.now().toISOString() });
  }

  async pendingAttestations(limit: number, { blockHoldMs = 0 }: { blockHoldMs?: number } = {}) {
    const cutoff = this.now().getTime() - blockHoldMs;
    return [...this.scans.values()]
      .filter((s) => s.attestStatus === 'pending' && (s.verdict !== 'block' || Date.parse(s.finishedAt ?? '') <= cutoff))
      .sort((a, b) => (a.finishedAt ?? '').localeCompare(b.finishedAt ?? ''))
      .slice(0, limit);
  }

  async markAttested(id: string, outcome: { tx: string } | { error: string }) {
    const s = this.scans.get(id);
    if (!s) return;
    if ('tx' in outcome) Object.assign(s, { attestStatus: 'published', attestTx: outcome.tx });
    else Object.assign(s, { attestStatus: 'failed', error: outcome.error });
  }

  async getIndicator(hash: string) {
    const row = this.indicators.get(hash);
    if (!row) return undefined;
    const { metaEventId: _m, statusEventId: _s, ...record } = row;
    return record;
  }

  async listIndicators(cursor: string | null, limit: number): Promise<Page<IndicatorRecord>> {
    const after = cursor ? decodeCursor(cursor)?.[1] : undefined;
    const rows = [...this.indicators.values()]
      .filter((r) => r.status === 'active' && (!after || r.hash > after))
      .sort((a, b) => a.hash.localeCompare(b.hash));
    const items = rows.slice(0, limit).map(({ metaEventId: _m, statusEventId: _s, ...r }) => r);
    const last = items.at(-1);
    return { items, nextCursor: rows.length > limit && last ? encodeCursor('hash', last.hash) : null };
  }

  async latestAttestation(repoId: string) {
    return [...this.attestations.values()].filter((a) => a.repoId === repoId).sort((a, b) => b.index - a.index)[0];
  }

  async applyEvents(events: IndexedEvent[], cursor: { name: string; value: string }) {
    for (const e of events) {
      if (e.type === 'attest') {
        const key = `${e.repoId}:${e.index}`;
        const current = this.attestations.get(key);
        const stored = e.stored;
        this.attestations.set(key, {
          repoId: e.repoId,
          index: e.index,
          commit: e.commit,
          verdict: e.verdict,
          attester: e.attester,
          reportHash: current?.reportHash ?? stored?.reportHash ?? null,
          rulesHash: current?.rulesHash ?? stored?.rulesHash ?? null,
          scanner: current?.scanner ?? stored?.scanner ?? null,
          retractedBy: current?.retractedBy ?? null,
          retractReason: current?.retractReason ?? null,
          ledger: e.ledger,
          txHash: e.txHash,
          closedAt: e.closedAt,
        });
      } else if (e.type === 'retract_attest') {
        const current = this.attestations.get(`${e.repoId}:${e.index}`);
        if (current) Object.assign(current, { retractedBy: e.by, retractReason: e.reason });
      } else {
        const row: IndicatorRow = this.indicators.get(e.hash) ?? {
          hash: e.hash,
          fileKind: null,
          campaign: null,
          evidence: null,
          status: 'proposed',
          approvals: 0,
          retractReason: null,
          ledger: e.ledger,
          txHash: e.txHash,
          metaEventId: null,
          statusEventId: '',
        };
        if (e.type === 'propose') {
          if (row.metaEventId === null || row.metaEventId < e.id) {
            Object.assign(row, { fileKind: e.fileKind, campaign: e.campaign, evidence: e.evidence, metaEventId: e.id });
          }
          if (row.statusEventId === '') Object.assign(row, { approvals: 1, statusEventId: e.id, ledger: e.ledger, txHash: e.txHash });
        } else if (row.statusEventId < e.id && row.status !== 'retracted') {
          if (e.type === 'approve') Object.assign(row, { status: e.status, approvals: e.approvals });
          else Object.assign(row, { status: 'retracted', retractReason: e.reason });
          Object.assign(row, { statusEventId: e.id, ledger: e.ledger, txHash: e.txHash });
        }
        this.indicators.set(e.hash, row);
      }
    }
    this.cursors.set(cursor.name, cursor.value);
  }

  async getCursor(name: string) {
    return this.cursors.get(name);
  }

  async resetIndex(cursorName: string) {
    this.indicators.clear();
    this.attestations.clear();
    this.cursors.delete(cursorName);
  }

  async close() {}
}
