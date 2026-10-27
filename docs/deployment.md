# Deployment

The backend runs as three services sharing one PostgreSQL database.

| Service | Image target | Holds secrets | Network |
|---|---|---|---|
| `server` | `server` | webhook secret, optional registry signing key | inbound HTTPS; outbound Stellar RPC |
| `worker` | `worker` | **none** | outbound to GitHub only |
| `indexer` | `indexer` | none | outbound Stellar RPC |

Build any of them with `docker build --target <service> .`.

## Configuration

| Variable | Service | Purpose |
|---|---|---|
| `DATABASE_URL` | all | PostgreSQL connection string |
| `PORT`, `HOST` | server | Listen address (default `0.0.0.0:8080`) |
| `GITHUB_WEBHOOK_SECRET` | server | GitHub App webhook secret; webhooks return 503 without it |
| `CORS_ORIGINS` | server | Comma-separated origins allowed to call the API from a browser (the `dome-frontend` origin) |
| `TRUST_PROXY` | server | `true` behind a load balancer, so rate limits see client addresses |
| `SCAN_RATE_LIMIT_PER_MINUTE` | server | Scan requests per client per minute (default 10) |
| `STELLAR_RPC_URL`, `REGISTRY_CONTRACT_ID`, `STELLAR_NETWORK_PASSPHRASE` | server, indexer | Dome Registry location; set all three or none |
| `REGISTRY_SIGNER_SECRET` | server | Signing key for publishing attestations; omit to disable publishing |
| `INDEXER_START_LEDGER` | indexer | First ledger to read when no cursor is saved; must be inside the RPC retention window |
| `WORKER_ID`, `POLL_INTERVAL_MS`, `JOB_TIMEOUT_MS` | worker | Worker identity and timing |

Run migrations before starting the server:

```bash
docker run --rm -e DATABASE_URL=... <server-image> node packages/server/dist/bin/migrate.js
```

## The worker sandbox

Workers read untrusted repositories. The engine never executes them, and
the sandbox assumes that guarantee might one day fail:

- **No credentials.** Workers get only `DATABASE_URL`, with a role that can
  read and update `scans` and read `indicators`. Attestations are signed by the
  server, never by a worker.
- **Unprivileged container.** Read-only root filesystem, all capabilities
  dropped, `no-new-privileges`, a non-root user, and a size-limited `tmpfs` at
  `/tmp` for clones. `docker-compose.yml` shows the settings.
- **Bounded resources.** CPU, memory and process-count limits, plus the job
  timeout (`JOB_TIMEOUT_MS`).
- **Egress to GitHub only.** Allow HTTPS to `github.com` and the database;
  deny everything else at the network layer (a Kubernetes `NetworkPolicy`, a
  security group, or an egress proxy). Compose cannot express this, so
  production must.
- **One job per worker, fresh scratch space.** Each clone is deleted after the
  scan; scale by adding workers.

A suggested database role for workers:

```sql
CREATE ROLE dome_worker LOGIN PASSWORD '...';
GRANT SELECT, UPDATE ON scans TO dome_worker;
GRANT SELECT ON indicators TO dome_worker;
```

## GitHub App

Create a GitHub App with:

- **Webhook URL:** `https://<api-host>/v1/webhooks/github`, with a secret
  stored in `GITHUB_WEBHOOK_SECRET`
- **Events:** Pull request, Push
- **Permissions:** Metadata (read), Contents (read), Pull requests (read)

Public repositories are scanned on every pull request update and every push
to the default branch. Private repositories are skipped until workers can
use per-installation tokens (milestone M6).

## Indexer

The indexer follows contract events through Stellar RPC and stores
indicators and attestations. The chain is the source of truth. To rebuild
the index, truncate `indicators`, `attestations` and `indexer_cursors` and
restart the indexer with an `INDEXER_START_LEDGER` inside the RPC retention
window.
