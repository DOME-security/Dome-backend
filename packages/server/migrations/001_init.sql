-- Scan jobs: queued by the API or GitHub webhooks, claimed by workers.
CREATE TABLE scans (
  id            uuid PRIMARY KEY,
  repo_url      text NOT NULL,
  owner         text NOT NULL,
  repo          text NOT NULL,
  ref           text,
  head_sha      text,
  base_sha      text,
  pull_request  integer,
  source        text NOT NULL CHECK (source IN ('api', 'webhook')),
  status        text NOT NULL CHECK (status IN ('queued', 'running', 'done', 'failed')),
  verdict       text CHECK (verdict IN ('clean', 'review', 'block', 'incomplete')),
  report        jsonb,
  error         text,
  attempts      integer NOT NULL DEFAULT 0,
  worker_id     text,
  attest_status text NOT NULL DEFAULT 'none' CHECK (attest_status IN ('none', 'pending', 'published', 'failed')),
  attest_tx     text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  started_at    timestamptz,
  finished_at   timestamptz
);
CREATE INDEX scans_queue ON scans (created_at) WHERE status IN ('queued', 'running');
CREATE INDEX scans_repo ON scans (owner, repo, created_at DESC);
CREATE INDEX scans_attest ON scans (finished_at) WHERE attest_status = 'pending';

-- Indicators approved (or revoked) on the Dome Registry, mirrored by the indexer.
CREATE TABLE indicators (
  kind       text NOT NULL CHECK (kind IN ('hash', 'marker', 'package', 'domain')),
  value      text NOT NULL,
  campaign   text NOT NULL,
  evidence   jsonb NOT NULL DEFAULT '[]',
  active     boolean NOT NULL,
  event_id   text NOT NULL,
  ledger     integer NOT NULL,
  tx_hash    text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (kind, value)
);
CREATE INDEX indicators_active ON indicators (kind, value) WHERE active;

-- On-chain scan attestations, mirrored by the indexer.
CREATE TABLE attestations (
  event_id    text PRIMARY KEY,
  owner       text NOT NULL,
  repo        text NOT NULL,
  commit_sha  text NOT NULL,
  verdict     text NOT NULL,
  report_hash text NOT NULL,
  attester    text NOT NULL,
  ledger      integer NOT NULL,
  tx_hash     text NOT NULL,
  closed_at   timestamptz NOT NULL
);
CREATE INDEX attestations_repo ON attestations (owner, repo, ledger DESC);

-- Where the indexer left off. The index can always be rebuilt from events.
CREATE TABLE indexer_cursors (
  name       text PRIMARY KEY,
  cursor     text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
