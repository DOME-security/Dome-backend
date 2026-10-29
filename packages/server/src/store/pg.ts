import { randomUUID } from 'node:crypto';
import type { ScanResult } from '@dome-security/engine';
import pg from 'pg';
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

interface ScanRow {
  id: string;
  repo_url: string;
  owner: string;
  repo: string;
  ref: string | null;
  head_sha: string | null;
  base_sha: string | null;
  pull_request: number | null;
  source: 'api' | 'webhook';
  status: ScanJob['status'];
  verdict: ScanJob['verdict'];
  report: ScanResult | null;
  error: string | null;
  attempts: number;
  attest_status: ScanJob['attestStatus'];
  attest_tx: string | null;
  created_at: Date;
  started_at: Date | null;
  finished_at: Date | null;
}

const iso = (d: Date | null) => (d ? d.toISOString() : null);

function toJob(r: ScanRow): ScanJob {
  return {
    id: r.id,
    repoUrl: r.repo_url,
    owner: r.owner,
    repo: r.repo,
    ref: r.ref,
    headSha: r.head_sha,
    baseSha: r.base_sha,
    pullRequest: r.pull_request,
    source: r.source,
    status: r.status,
    verdict: r.verdict,
    report: r.report,
    error: r.error,
    attempts: r.attempts,
    attestStatus: r.attest_status,
    attestTx: r.attest_tx,
    createdAt: r.created_at.toISOString(),
    startedAt: iso(r.started_at),
    finishedAt: iso(r.finished_at),
  };
}

interface IndicatorRow {
  hash: string;
  file_kind: IndicatorRecord['fileKind'];
  campaign: string | null;
  evidence: string | null;
  status: IndicatorRecord['status'];
  approvals: number;
  retract_reason: string | null;
  ledger: number;
  tx_hash: string;
}

const toIndicator = (r: IndicatorRow): IndicatorRecord => ({
  hash: r.hash,
  fileKind: r.file_kind,
  campaign: r.campaign,
  evidence: r.evidence,
  status: r.status,
  approvals: r.approvals,
  retractReason: r.retract_reason,
  ledger: r.ledger,
  txHash: r.tx_hash,
});

interface AttestationRow {
  repo_id: string;
  idx: number;
  commit_sha: string;
  verdict: AttestationRecord['verdict'];
  attester: string;
  report_hash: string | null;
  rules_hash: string | null;
  scanner: string | null;
  retracted_by: string | null;
  retract_reason: string | null;
  ledger: number;
  tx_hash: string;
  closed_at: Date;
}

const toAttestation = (r: AttestationRow): AttestationRecord => ({
  repoId: r.repo_id,
  index: r.idx,
  commit: r.commit_sha,
  verdict: r.verdict,
  attester: r.attester,
  reportHash: r.report_hash,
  rulesHash: r.rules_hash,
  scanner: r.scanner === null ? null : Number(r.scanner),
  retractedBy: r.retracted_by,
  retractReason: r.retract_reason,
  ledger: r.ledger,
  txHash: r.tx_hash,
  closedAt: r.closed_at.toISOString(),
});

export class PgStore implements Store {
  constructor(readonly pool: pg.Pool) {}

  static connect(connectionString: string, max = 10): PgStore {
    return new PgStore(new pg.Pool({ connectionString, max }));
  }

  async enqueueScan(input: NewScan) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      // Serialize enqueues per repository so two identical requests cannot both insert.
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`${input.owner}/${input.repo}`]);
      const existing = await client.query<ScanRow>(
        `SELECT * FROM scans WHERE owner = $1 AND repo = $2 AND status IN ('queued', 'running')
           AND head_sha IS NOT DISTINCT FROM $3 AND ref IS NOT DISTINCT FROM $4 LIMIT 1`,
        [input.owner, input.repo, input.headSha ?? null, input.ref ?? null],
      );
      if (existing.rows[0]) {
        await client.query('COMMIT');
        return { job: toJob(existing.rows[0]), created: false };
      }
      const inserted = await client.query<ScanRow>(
        `INSERT INTO scans (id, repo_url, owner, repo, ref, head_sha, base_sha, pull_request, source, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'queued') RETURNING *`,
        [
          randomUUID(),
          input.repoUrl,
          input.owner,
          input.repo,
          input.ref ?? null,
          input.headSha ?? null,
          input.baseSha ?? null,
          input.pullRequest ?? null,
          input.source,
        ],
      );
      await client.query('COMMIT');
      return { job: toJob(inserted.rows[0]!), created: true };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getScan(id: string) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) return undefined;
    const res = await this.pool.query<ScanRow>('SELECT * FROM scans WHERE id = $1', [id]);
    return res.rows[0] && toJob(res.rows[0]);
  }

  async latestScan(owner: string, repo: string) {
    const res = await this.pool.query<ScanRow>('SELECT * FROM scans WHERE owner = $1 AND repo = $2 ORDER BY created_at DESC LIMIT 1', [
      owner,
      repo,
    ]);
    return res.rows[0] && toJob(res.rows[0]);
  }

  async claimScan(workerId: string, staleAfterMs: number, maxAttempts: number) {
    const stale = `${Math.ceil(staleAfterMs / 1000)} seconds`;
    await this.pool.query(
      `UPDATE scans SET status = 'failed', error = 'worker timed out', finished_at = now()
        WHERE status = 'running' AND started_at < now() - $1::interval AND attempts >= $2`,
      [stale, maxAttempts],
    );
    const res = await this.pool.query<ScanRow>(
      `UPDATE scans SET status = 'running', started_at = now(), attempts = attempts + 1, worker_id = $1
        WHERE id = (
          SELECT id FROM scans
           WHERE status = 'queued' OR (status = 'running' AND started_at < now() - $2::interval)
           ORDER BY created_at
           FOR UPDATE SKIP LOCKED
           LIMIT 1)
        RETURNING *`,
      [workerId, stale],
    );
    return res.rows[0] && toJob(res.rows[0]);
  }

  async completeScan(id: string, result: ScanResult, { attestable, headSha }: { attestable: boolean; headSha?: string }) {
    await this.pool.query(
      `UPDATE scans SET status = 'done', verdict = $2, report = $3, finished_at = now(), error = NULL,
              head_sha = COALESCE($5, head_sha),
              attest_status = CASE WHEN $4 THEN 'pending' ELSE 'none' END
        WHERE id = $1`,
      [id, result.verdict, JSON.stringify(result), attestable, headSha ?? null],
    );
  }

  async failScan(id: string, error: string) {
    await this.pool.query(`UPDATE scans SET status = 'failed', error = $2, finished_at = now() WHERE id = $1`, [id, error]);
  }

  async pendingAttestations(limit: number, { blockHoldMs = 0 }: { blockHoldMs?: number } = {}) {
    const res = await this.pool.query<ScanRow>(
      `SELECT * FROM scans
        WHERE attest_status = 'pending'
          AND (verdict IS DISTINCT FROM 'block' OR finished_at <= now() - make_interval(secs => $2::double precision / 1000))
        ORDER BY finished_at LIMIT $1`,
      [limit, blockHoldMs],
    );
    return res.rows.map(toJob);
  }

  async markAttested(id: string, outcome: { tx: string } | { error: string }) {
    if ('tx' in outcome) {
      await this.pool.query(`UPDATE scans SET attest_status = 'published', attest_tx = $2 WHERE id = $1`, [id, outcome.tx]);
    } else {
      await this.pool.query(`UPDATE scans SET attest_status = 'failed', error = $2 WHERE id = $1`, [id, outcome.error]);
    }
  }

  async getIndicator(hash: string) {
    const res = await this.pool.query<IndicatorRow>('SELECT * FROM indicators WHERE hash = $1', [hash]);
    return res.rows[0] && toIndicator(res.rows[0]);
  }

  async listIndicators(cursor: string | null, limit: number): Promise<Page<IndicatorRecord>> {
    const after = cursor ? decodeCursor(cursor)?.[1] : undefined;
    const res = await this.pool.query<IndicatorRow>(
      `SELECT * FROM indicators WHERE status = 'active' AND ($1::text IS NULL OR hash > $1) ORDER BY hash LIMIT $2`,
      [after ?? null, limit + 1],
    );
    const items = res.rows.slice(0, limit).map(toIndicator);
    const last = items.at(-1);
    return { items, nextCursor: res.rows.length > limit && last ? encodeCursor('hash', last.hash) : null };
  }

  async latestAttestation(repoId: string): Promise<AttestationRecord | undefined> {
    const res = await this.pool.query<AttestationRow>('SELECT * FROM attestations WHERE repo_id = $1 ORDER BY idx DESC LIMIT 1', [repoId]);
    return res.rows[0] && toAttestation(res.rows[0]);
  }

  async applyEvents(events: IndexedEvent[], cursor: { name: string; value: string }) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      for (const e of events) {
        if (e.type === 'attest') {
          await client.query(
            `INSERT INTO attestations (repo_id, idx, commit_sha, verdict, attester, report_hash, rules_hash, scanner, event_id, ledger, tx_hash, closed_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             ON CONFLICT (repo_id, idx) DO UPDATE SET
               report_hash = COALESCE(attestations.report_hash, EXCLUDED.report_hash),
               rules_hash = COALESCE(attestations.rules_hash, EXCLUDED.rules_hash),
               scanner = COALESCE(attestations.scanner, EXCLUDED.scanner)`,
            [
              e.repoId,
              e.index,
              e.commit,
              e.verdict,
              e.attester,
              e.stored?.reportHash ?? null,
              e.stored?.rulesHash ?? null,
              e.stored?.scanner ?? null,
              e.id,
              e.ledger,
              e.txHash,
              e.closedAt,
            ],
          );
        } else if (e.type === 'retract_attest') {
          await client.query(`UPDATE attestations SET retracted_by = $3, retract_reason = $4 WHERE repo_id = $1 AND idx = $2`, [
            e.repoId,
            e.index,
            e.by,
            e.reason,
          ]);
        } else if (e.type === 'propose') {
          await client.query(
            `INSERT INTO indicators (hash, file_kind, campaign, evidence, status, approvals, meta_event_id, status_event_id, ledger, tx_hash)
             VALUES ($1, $2, $3, $4, 'proposed', 1, $5, $5, $6, $7)
             ON CONFLICT (hash) DO UPDATE SET file_kind = EXCLUDED.file_kind, campaign = EXCLUDED.campaign,
               evidence = EXCLUDED.evidence, meta_event_id = EXCLUDED.meta_event_id, updated_at = now()
             WHERE indicators.meta_event_id IS NULL OR indicators.meta_event_id < EXCLUDED.meta_event_id`,
            [e.hash, e.fileKind, e.campaign, e.evidence, e.id, e.ledger, e.txHash],
          );
        } else {
          const status = e.type === 'approve' ? e.status : 'retracted';
          await client.query(
            `INSERT INTO indicators (hash, status, approvals, retract_reason, status_event_id, ledger, tx_hash)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (hash) DO UPDATE SET status = EXCLUDED.status,
               approvals = CASE WHEN EXCLUDED.status = 'retracted' THEN indicators.approvals ELSE EXCLUDED.approvals END,
               retract_reason = EXCLUDED.retract_reason, status_event_id = EXCLUDED.status_event_id,
               ledger = EXCLUDED.ledger, tx_hash = EXCLUDED.tx_hash, updated_at = now()
             WHERE indicators.status_event_id < EXCLUDED.status_event_id AND indicators.status <> 'retracted'`,
            [e.hash, status, e.type === 'approve' ? e.approvals : 0, e.type === 'retract' ? e.reason : null, e.id, e.ledger, e.txHash],
          );
        }
      }
      await client.query(
        `INSERT INTO indexer_cursors (name, cursor) VALUES ($1, $2)
         ON CONFLICT (name) DO UPDATE SET cursor = EXCLUDED.cursor, updated_at = now()`,
        [cursor.name, cursor.value],
      );
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getCursor(name: string) {
    const res = await this.pool.query<{ cursor: string }>('SELECT cursor FROM indexer_cursors WHERE name = $1', [name]);
    return res.rows[0]?.cursor;
  }

  async resetIndex(cursorName: string) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM indicators');
      await client.query('DELETE FROM attestations');
      await client.query('DELETE FROM indexer_cursors WHERE name = $1', [cursorName]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async close() {
    await this.pool.end();
  }
}
