-- Mirror the Dome Registry contract as deployed (dome-contracts), replacing
-- the schema 001 assumed before the contract existed. The old tables are kept
-- under *_v1 names instead of dropped; they never held real registry events,
-- because the old decoder did not match the contract's events. The indexer
-- cursor is cleared so the index is rebuilt from the configured start ledger.

ALTER TABLE indicators RENAME TO indicators_v1;
ALTER INDEX indicators_active RENAME TO indicators_v1_active;
ALTER TABLE attestations RENAME TO attestations_v1;
ALTER INDEX attestations_repo RENAME TO attestations_v1_repo;
DELETE FROM indexer_cursors WHERE name = 'dome-registry';

-- Indicators: SHA-256 fingerprints of malicious files. The proposal sets the
-- metadata, approvals and retractions set the status; each part has its own
-- event-id guard so replaying events changes nothing.
CREATE TABLE indicators (
  hash            text PRIMARY KEY CHECK (hash ~ '^[0-9a-f]{64}$'),
  file_kind       text CHECK (file_kind IN ('task', 'font', 'config', 'script', 'package')),
  campaign        text,
  evidence        text CHECK (evidence ~ '^[0-9a-f]{64}$'),
  status          text NOT NULL CHECK (status IN ('proposed', 'active', 'retracted')),
  approvals       integer NOT NULL DEFAULT 0,
  retract_reason  text,
  meta_event_id   text,
  status_event_id text NOT NULL,
  ledger          integer NOT NULL,
  tx_hash         text NOT NULL,
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX indicators_active ON indicators (hash) WHERE status = 'active';

-- Attestations: one row per entry in a repository's on-chain history.
CREATE TABLE attestations (
  repo_id        text NOT NULL CHECK (repo_id ~ '^[0-9a-f]{64}$'),
  idx            integer NOT NULL CHECK (idx >= 0),
  commit_sha     text NOT NULL,
  verdict        text NOT NULL CHECK (verdict IN ('clean', 'review', 'block', 'unreadable')),
  attester       text NOT NULL,
  report_hash    text,
  rules_hash     text,
  scanner        bigint,
  retracted_by   text,
  retract_reason text,
  event_id       text NOT NULL,
  ledger         integer NOT NULL,
  tx_hash        text NOT NULL,
  closed_at      timestamptz NOT NULL,
  PRIMARY KEY (repo_id, idx)
);

-- Incomplete scans are attested as "unreadable", so they can be pending too.
CREATE INDEX scans_attest_verdict ON scans (verdict, finished_at) WHERE attest_status = 'pending';
