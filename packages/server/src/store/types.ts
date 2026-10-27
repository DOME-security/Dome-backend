import type { ScanResult, Verdict } from '@dome-security/engine';
import type { ApproveEvent, AttestEvent, IndicatorKind, RevokeEvent } from '@dome-security/registry-client';

export type ScanStatus = 'queued' | 'running' | 'done' | 'failed';
export type AttestStatus = 'none' | 'pending' | 'published' | 'failed';

export interface ScanJob {
  id: string;
  repoUrl: string;
  owner: string;
  repo: string;
  ref: string | null;
  headSha: string | null;
  baseSha: string | null;
  pullRequest: number | null;
  source: 'api' | 'webhook';
  status: ScanStatus;
  verdict: Verdict | null;
  report: ScanResult | null;
  error: string | null;
  attempts: number;
  attestStatus: AttestStatus;
  attestTx: string | null;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
}

export interface NewScan {
  repoUrl: string;
  owner: string;
  repo: string;
  ref?: string | null;
  headSha?: string | null;
  baseSha?: string | null;
  pullRequest?: number | null;
  source: 'api' | 'webhook';
}

export interface IndicatorRecord {
  kind: IndicatorKind;
  value: string;
  campaign: string;
  evidence: string[];
  active: boolean;
  ledger: number;
  txHash: string;
}

export interface AttestationRecord {
  owner: string;
  repo: string;
  commit: string;
  verdict: string;
  reportHash: string;
  attester: string;
  ledger: number;
  txHash: string;
  closedAt: string;
}

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

export interface Store {
  /** Queues a scan, or returns the queued/running scan for the same repository and commit. */
  enqueueScan(input: NewScan): Promise<{ job: ScanJob; created: boolean }>;
  getScan(id: string): Promise<ScanJob | undefined>;
  latestScan(owner: string, repo: string): Promise<ScanJob | undefined>;
  /**
   * Claims the oldest queued scan (or one whose worker went silent for
   * `staleAfterMs`). Scans that have been attempted `maxAttempts` times fail.
   */
  claimScan(workerId: string, staleAfterMs: number, maxAttempts: number): Promise<ScanJob | undefined>;
  /**
   * Stores a finished scan. `headSha` records the commit actually scanned;
   * attestable scans (default-branch heads) are queued for publishing.
   */
  completeScan(id: string, result: ScanResult, options: { attestable: boolean; headSha?: string }): Promise<void>;
  failScan(id: string, error: string): Promise<void>;
  /** Finished scans waiting to be attested on chain. */
  pendingAttestations(limit: number): Promise<ScanJob[]>;
  markAttested(id: string, outcome: { tx: string } | { error: string }): Promise<void>;

  getIndicator(kind: IndicatorKind, value: string): Promise<IndicatorRecord | undefined>;
  listIndicators(cursor: string | null, limit: number): Promise<Page<IndicatorRecord>>;
  latestAttestation(owner: string, repo: string): Promise<AttestationRecord | undefined>;

  /** Applies registry events idempotently; older events never overwrite newer ones. */
  applyEvents(events: (AttestEvent | ApproveEvent | RevokeEvent)[], cursor: { name: string; value: string }): Promise<void>;
  getCursor(name: string): Promise<string | undefined>;

  close(): Promise<void>;
}

export function encodeCursor(kind: string, value: string): string {
  return Buffer.from(JSON.stringify([kind, value])).toString('base64url');
}

export function decodeCursor(cursor: string): [string, string] | undefined {
  try {
    const parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')) as unknown;
    if (Array.isArray(parsed) && parsed.length === 2 && parsed.every((p) => typeof p === 'string')) return parsed as [string, string];
  } catch {
    // fall through
  }
  return undefined;
}
