import { randomUUID } from 'node:crypto';
import type { ScanResult } from '@dome-security/engine';
import type { ApproveEvent, AttestEvent, RevokeEvent } from '@dome-security/registry-client';
import pg from 'pg';
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
  kind: IndicatorRecord['kind'];
  value: string;
  campaign: string;
  evidence: string[];
  active: boolean;
  ledger: number;
  tx_hash: string;
}

const toIndicator = (r: IndicatorRow): IndicatorRecord => ({
  kind: r.kind,
  value: r.value,
  campaign: r.campaign,
  evidence: r.evidence,
  active: r.active,
  ledger: r.ledger,
  txHash: r.tx_hash,
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
      [id, result.verdict, JSON.stringify(result), attestable && result.verdict !== 'incomplete', headSha ?? null],
    );
  }

  async failScan(id: string, error: string) {
    await this.pool.query(`UPDATE scans SET status = 'failed', error = $2, finished_at = now() WHERE id = $1`, [id, error]);
  }

  async pendingAttestations(limit: number) {
    const res = await this.pool.query<ScanRow>(
      `SELECT * FROM scans WHERE attest_status = 'pending' ORDER BY finished_at LIMIT $1`,
      [limit],
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

  async getIndicator(kind: IndicatorRecord['kind'], value: string) {
    const res = await this.pool.query<IndicatorRow>('SELECT * FROM indicators WHERE kind = $1 AND value = $2', [kind, value]);
    return res.rows[0] && toIndicator(res.rows[0]);
  }

  async listIndicators(cursor: string | null, limit: number): Promise<Page<IndicatorRecord>> {
    const after = cursor ? decodeCursor(cursor) : undefined;
    const res = await this.pool.query<IndicatorRow>(
      `SELECT * FROM indicators WHERE active AND ($1::text IS NULL OR (kind, value) > ($1, $2))
        ORDER BY kind, value LIMIT $3`,
      [after?.[0] ?? null, after?.[1] ?? null, limit + 1],
    );
    const items = res.rows.slice(0, limit).map(toIndicator);
    const last = items.at(-1);
    return { items, nextCursor: res.rows.length > limit && last ? encodeCursor(last.kind, last.value) : null };
  }

  async latestAttestation(owner: string, repo: string): Promise<AttestationRecord | undefined> {
    const res = await this.pool.query<{
      owner: string;
      repo: string;
      commit_sha: string;
      verdict: string;
      report_hash: string;
      attester: string;
      ledger: number;
      tx_hash: string;
      closed_at: Date;
    }>('SELECT * FROM attestations WHERE owner = $1 AND repo = $2 ORDER BY event_id DESC LIMIT 1', [owner, repo]);
    const r = res.rows[0];
    return (
      r && {
        owner: r.owner,
        repo: r.repo,
        commit: r.commit_sha,
        verdict: r.verdict,
        reportHash: r.report_hash,
        attester: r.attester,
        ledger: r.ledger,
        txHash: r.tx_hash,
        closedAt: r.closed_at.toISOString(),
      }
    );
  }

  async applyEvents(events: (AttestEvent | ApproveEvent | RevokeEvent)[], cursor: { name: string; value: string }) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      for (const e of events) {
        if (e.type === 'attest') {
          const [owner, repo] = e.repo.split('/');
          await client.query(
            `INSERT INTO attestations (event_id, owner, repo, commit_sha, verdict, report_hash, attester, ledger, tx_hash, closed_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (event_id) DO NOTHING`,
            [e.id, owner, repo, e.commit, e.verdict, e.reportHash, e.attester, e.ledger, e.txHash, e.closedAt],
          );
        } else {
          const approve = e.type === 'approve';
          await client.query(
            `INSERT INTO indicators (kind, value, campaign, evidence, active, event_id, ledger, tx_hash)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (kind, value) DO UPDATE SET
               campaign = CASE WHEN EXCLUDED.active THEN EXCLUDED.campaign ELSE indicators.campaign END,
               evidence = CASE WHEN EXCLUDED.active THEN EXCLUDED.evidence ELSE indicators.evidence END,
               active = EXCLUDED.active, event_id = EXCLUDED.event_id, ledger = EXCLUDED.ledger,
               tx_hash = EXCLUDED.tx_hash, updated_at = now()
             WHERE indicators.event_id < EXCLUDED.event_id`,
            [e.kind, e.value, approve ? e.campaign : '', JSON.stringify(approve ? e.evidence : []), approve, e.id, e.ledger, e.txHash],
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

  async close() {
    await this.pool.end();
  }
}
