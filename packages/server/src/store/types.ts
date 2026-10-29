import type { ScanResult, Verdict } from '@dome-security/engine';
import type {
  AttestEvent,
  IndicatorFileKind,
  IndicatorStatus,
  OnChainAttestation,
  RegistryEvent,
  RegistryVerdict,
} from '@dome-security/registry-client';

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

/** A Dome Registry indicator: the SHA-256 of a malicious file, as mirrored by the indexer. */
export interface IndicatorRecord {
  /** Lowercase hex SHA-256 of the file. */
  hash: string;
  /** `null` when the proposal happened before the indexer's first ledger. */
  fileKind: IndicatorFileKind | null;
  campaign: string | null;
  /** Hex SHA-256 of the public advisory, from the proposal. */
  evidence: string | null;
  status: IndicatorStatus;
  approvals: number;
  retractReason: string | null;
  /** Ledger and transaction of the latest status change. */
  ledger: number;
  txHash: string;
}

/** A Dome Registry attestation, as mirrored by the indexer. */
export interface AttestationRecord {
  repoId: string;
  index: number;
  commit: string;
  verdict: RegistryVerdict;
  attester: string;
  /** From the stored attestation; `null` until the indexer could read it. */
  reportHash: string | null;
  rulesHash: string | null;
  scanner: number | null;
  retractedBy: string | null;
  retractReason: string | null;
  ledger: number;
  txHash: string;
  closedAt: string;
}

/** An attest event plus the fields only the stored attestation has. */
export type IndexedEvent = Exclude<RegistryEvent, AttestEvent> | (AttestEvent & { stored?: OnChainAttestation });

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
  /**
   * Finished scans waiting to be attested on chain, oldest first. A `block`
   * result is only returned once it finished more than `blockHoldMs` ago:
   * the publication policy gives maintainers time to respond first.
   */
  pendingAttestations(limit: number, options?: { blockHoldMs?: number }): Promise<ScanJob[]>;
  markAttested(id: string, outcome: { tx: string } | { error: string }): Promise<void>;

  getIndicator(hash: string): Promise<IndicatorRecord | undefined>;
  /** Active indicators, ordered by hash. */
  listIndicators(cursor: string | null, limit: number): Promise<Page<IndicatorRecord>>;
  /** The newest attestation (highest index) for a registry repo id. */
  latestAttestation(repoId: string): Promise<AttestationRecord | undefined>;

  /**
   * Applies registry events and saves the cursor atomically. Idempotent:
   * replaying events, or applying an older event after a newer one, never
   * changes the result.
   */
  applyEvents(events: IndexedEvent[], cursor: { name: string; value: string }): Promise<void>;
  getCursor(name: string): Promise<string | undefined>;
  /** Deletes the indexed registry data and the cursor, so the indexer rebuilds from its start ledger. */
  resetIndex(cursorName: string): Promise<void>;

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

/**
 * A registry indicator in the format the engine's intel data uses. Evidence
 * is the advisory digest from the proposal (when the indexer saw it) and the
 * registry transaction behind its current status, both publicly checkable.
 */
export function toIntelIndicator(r: IndicatorRecord): { kind: 'hash'; value: string; campaign: string; evidence: string[]; fileKind: IndicatorRecord['fileKind'] } {
  return {
    kind: 'hash',
    value: r.hash,
    campaign: r.campaign ?? 'unknown',
    evidence: [...(r.evidence ? [`sha256:${r.evidence}`] : []), `stellar-tx:${r.txHash}`],
    fileKind: r.fileKind,
  };
}
