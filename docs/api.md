# API reference

All responses are JSON. Errors are `{ "error": "<message>" }` with a 4xx or
5xx status. Unknown fields in request bodies are rejected.

## `POST /v1/scans`

Queue a scan of a **public** GitHub repository.

```bash
curl -X POST https://<api-host>/v1/scans \
  -H 'content-type: application/json' \
  -d '{ "url": "https://github.com/owner/repo", "ref": "main" }'
```

| Field | Required | Meaning |
|---|---|---|
| `url` | yes | `https://github.com/<owner>/<repo>` |
| `ref` | no | Branch or tag; the default branch when omitted |

`202 Accepted` with `{ "id", "status": "queued", "links": { "self" } }` and a
`Location` header. If the same repository and ref is already queued or
running, the existing scan is returned with `200`. Rate limited per client
(`429` when exceeded).

## `GET /v1/scans/:id`

```json
{
  "id": "5d7c060a-…",
  "repository": { "owner": "octocat", "repo": "Hello-World", "url": "https://github.com/octocat/Hello-World" },
  "ref": null,
  "commit": "7fd1a60b01f91b314f59955a4e4d4e80d8edf11d",
  "pullRequest": null,
  "status": "done",
  "verdict": "clean",
  "createdAt": "…", "startedAt": "…", "finishedAt": "…",
  "report": { "verdict": "clean", "findings": [], "…": "…" },
  "reportHash": "f9c7395c…",
  "attestation": null
}
```

`status` is `queued`, `running`, `done` or `failed`; `verdict` is `clean`,
`review`, `block` or `incomplete`. `report` is the engine's JSON report.
`reportHash` is the SHA-256 of the report as canonical JSON (keys sorted),
which is the value attested on chain; anyone can recompute it.
`attestation` is `{ "tx": "<hash>" }` once published.

## `GET /v1/repos/:owner/:repo`

The latest scan (same shape as above) and the latest on-chain attestation:

```json
{
  "repository": { "owner": "o", "repo": "r" },
  "latestScan": { "…": "…" },
  "attestation": {
    "commit": "…", "verdict": "clean", "reportHash": "…",
    "attester": "G…", "ledger": 123, "txHash": "…", "closedAt": "…"
  }
}
```

## `GET /v1/indicators/:sha256`

```json
{ "sha256": "…", "known": true, "campaign": "PolinRider", "evidence": ["https://…"], "ledger": 123, "txHash": "…" }
```

or `{ "sha256": "…", "known": false }`.

## `GET /v1/indicators?limit=&cursor=`

Active indicators approved on the Dome Registry, ordered by kind and value.
`limit` is 1–500 (default 100). This is the endpoint `dome intel update`
reads.

```json
{
  "indicators": [{ "kind": "package", "value": "…", "campaign": "…", "evidence": ["https://…"] }],
  "nextCursor": "WyJwYWNrYWdlIiwi…" 
}
```

## `POST /v1/webhooks/github`

GitHub App deliveries. The `X-Hub-Signature-256` header is verified over the
raw body; invalid signatures get `401`. Pull request `opened`, `synchronize`,
`reopened` and `ready_for_review` events queue a diff scan of the pull
request head; pushes to the default branch queue a full scan. Other events
are acknowledged with `202 { "ignored": "<reason>" }`.

## `GET /healthz`

`{ "ok": true }`.
