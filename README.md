# dome-backend

**Auto-run malware detection for open-source repositories.**

dome-backend holds everything in Dome that scans and serves: the detection engine and rules, the `dome` CLI, the GitHub Action, the API server with its GitHub App webhook intake, sandboxed scan workers, and the registry indexer. Dome finds code a repository will run without asking (VS Code tasks, npm install hooks, dev container commands, AI-agent hooks, GitHub workflows, payloads hidden in config files or fake fonts) and tells you which of those look like a known attack. It reads files as text and bytes. It never executes them.

Part of the Dome Security GitHub org, alongside `dome-frontend` (the web app) and `dome-contracts` (the on-chain Dome Registry). Built for the Stellar Wave Program on Drips, after auto-run attacks reached several Wave repositories through merged pull requests in October 2026.

---

## What it does

- **Auto-run surface detection:** flags `.vscode/tasks.json` tasks with `runOn: folderOpen`, `task.allowAutomaticTasks: on`, `.vscode` hidden by `files.exclude`, npm `preinstall`/`postinstall`/`prepare` scripts, dev container commands, AI agent hooks (`.claude/`, `.cursor/`, `.mcp.json`), new or changed GitHub workflows, `.gitignore` changes and committed git hooks (`DOME-VSC-*`, `DOME-NPM-*`, `DOME-DEV-*`, `DOME-AGT-*`, `DOME-GHA-*`, `DOME-GIT-*`).
- **Payload detection:** fake fonts checked by format header fields rather than magic bytes, assets referenced from execution positions, code appended after the module body in JS/TS config files, heavy whitespace padding, runtime code construction (`eval`, `new Function`, `vm.runIn*`), `.env` exfiltration and clock-rewinding force-push propagation scripts (`DOME-AST-*`, `DOME-CFG-*`, `DOME-ENV-*`, `DOME-PRP-*`).
- **Known indicators and Stellar-specific rules:** known-bad file hashes, published campaign markers, malicious npm packages and C2 domains, kept in `packages/intel` data files so they update without a release (`DOME-IOC-*`); plus code that reads Stellar CLI identities or browser wallet storage, and committed Stellar secret keys (`DOME-STL-*`).
- **Graded verdicts, not alarm floods:** 🔴 **block** for payloads and indicator matches (fails the check), 🟠 **review** when an auto-run surface is added or changed, ⚪ **info** for context. Combinations escalate: `DOME-VSC-001` alone is review; with `DOME-AST-001` in the same change it is block. Reasons never quote text chosen by the scanned repo.
- **Three ways to scan:** the `dome` CLI (`dome scan`, `dome sweep`, `dome sweep-remote`, `dome intel update`, `dome init`) with text, JSON, SARIF and Markdown output; a fork-safe GitHub Action (`pull_request` only, `contents: read`, `report` or `enforce` mode); and a REST API and a GitHub App webhook endpoint that power `dome-frontend`. Org-wide install, private repositories and scheduled sweeps are planned (see [Roadmap](#roadmap)).
- **Per-repo configuration:** an optional `.dome.yml` marks fixtures, accepts a reviewed task by content hash and raises severities. It can never lower a block caused by a known indicator.

## How findings are graded

Every finding has a level: 🔴 **block**, 🟠 **review** or ⚪ **info**. A scan's verdict is the highest level found, except that a file Dome could not check makes the verdict **incomplete** ("could not check") unless something already blocks. A scan is never clean when a relevant file was too large, unreadable, unparseable or a symlink.

- A rule's default level is listed in [`docs/rules/`](docs/rules/README.md); some reasons set their own (a task that runs a font with `node` always blocks).
- **Combinations escalate.** In a diff scan, a payload finding (`DOME-AST-001`, `DOME-CFG-001`, `DOME-CFG-003`, `DOME-ENV-001`) plus any auto-run surface in the same change becomes one block. In a full scan, a folder-open task (`DOME-VSC-001`) plus a fake font (`DOME-AST-001`) anywhere in the tree blocks. A folder-open task, automatic tasks turned on and a hidden `.vscode` together block. A folder-open task alone is review.
- **Configuration.** `.dome.yml` can mark fixture paths, accept a reviewed finding by content hash, and change levels. Known-indicator findings (`DOME-IOC-*`) can never be lowered. A repository's own `.dome.yml` is *untrusted* by default: it can raise levels but its fixtures, allow entries and lowered levels are ignored. It is trusted only where it comes from a branch the maintainers control (the Action, which reads it from the base commit of a pull request, and `dome scan --trust-config`).
- **Fixed wording.** Every reason is text written in the rule, keyed by rule ID. Nothing the scanned repository wrote reaches a verdict; file paths are the only repository-chosen text in a report, and control, zero-width and bidi characters are stripped from them.

## Status

Pre-alpha, nothing released yet (packages are at 0.1.0). Milestones M1 to M5 are implemented: the engine with 27 rules, the CLI, the GitHub Action, the API server, scan workers and the registry indexer. M6 (the org-wide GitHub App) has only its webhook intake; install flow, private repositories, scheduled sweeps and alerts are planned. See [Roadmap](#roadmap). The registry client follows the Dome Registry through bindings generated in `dome-contracts` and vendored here (see [`packages/registry-client/vendor/README.md`](packages/registry-client/vendor/README.md)). Rule behaviour is documented in [`docs/rules/`](docs/rules/README.md), and the false-positive corpus covers 36 public repositories.

## Architecture

```
packages/
├── engine/           File walker, git object reader, parsers, rules, grading (no network, no exec)
│   ├── parsers/      jsonc, package.json, devcontainer, workflow YAML, JS tokenizer, font headers
│   ├── rules/        One file per rule, each with fixtures and tests
│   └── report/       text, json, sarif, markdown reporters
├── intel/            Versioned indicator data (hashes, packages, domains, markers) + loader
├── cli/              `dome scan`, `dome sweep`, `dome sweep-remote`, `dome intel`, `dome init`
├── action/           The GitHub Action (bundled; used as dome-security/dome-backend/packages/action@<sha>)
├── server/           Fastify REST API + GitHub App webhooks
├── worker/           Scan workers pulling jobs from a queue; run in the sandbox defined by Dockerfile and docker-compose.yml
├── indexer/          Follows Dome Registry contract events into PostgreSQL
└── registry-client/  Thin wrapper over the bindings generated in dome-contracts

deploy/
└── egress-proxy/     The GitHub-only proxy that is the workers' only way off their network

test/
├── fixtures/         INERT look-alikes only, one folder per scenario
├── corpus/           Known-honest public repos used for false-positive runs
└── sandbox/          Docker test proving a worker cannot reach hosts other than GitHub

openapi.json          Generated from the server route schemas (pnpm openapi)
packages/engine/rules.json   Generated rule catalogue: id, level, title, description, docsUrl

docs/
├── rules/            One page per rule: what, why, references, false positives
├── api.md
├── deployment.md
├── incident-response.md
└── writing-a-rule.md

.dome.yml             We scan ourselves on every PR
```

One TypeScript monorepo, with each package published or deployed on its own:

| Layer | Packages | Used by |
|---|---|---|
| Detection | `engine`, `intel` | everything else |
| Developer tooling | `cli` | developers on their own machines |
| CI | `action` | maintainers, in their repos' CI |
| Service | `server`, `worker` | the web app (`dome-frontend`) and the GitHub App |
| Registry | `indexer`, `registry-client` | the server, to serve registry data fast and to publish attestations |

## Tech stack

- **Language**: TypeScript monorepo managed with pnpm workspaces
- **Engine**: Linear-time JSONC, YAML and JS tokenizer parsers; font header validation; text, JSON, SARIF 2.1.0 and Markdown reporters
- **API**: Fastify REST API (`/v1/scans`, `/v1/repos`, `/v1/indicators`, `/v1/webhooks/github`) and GitHub App webhooks (`pull_request` and default-branch `push` on public repos)
- **Workers**: Docker containers, unprivileged with a read-only root filesystem, no credentials, on a network with no route out except a proxy that tunnels to GitHub only
- **Data**: PostgreSQL index of Dome Registry events, read through Stellar RPC; the chain stays the source of truth

## Getting started

> Contributions come through the Stellar Wave Program on Drips. Find an issue labelled `Stellar Wave`, apply in the [Drips Wave app](https://www.drips.network/wave) and wait to be assigned before starting. Every PR needs tests (inert fixtures only), docs for any new rule or endpoint, and a false-positive run for rule changes. See the [Drips Wave Terms and Rules](https://docs.drips.network/wave/terms-and-rules).

Requirements: Node 22+, pnpm, Docker (for workers and PostgreSQL).

```bash
git clone https://github.com/dome-security/dome-backend.git
cd dome-backend

# This repo never relies on install scripts
pnpm install --ignore-scripts

# API on :8080 with a local PostgreSQL in Docker
pnpm dev:server
```

Run the test suites:

```bash
pnpm test           # unit tests + fixtures
pnpm test:corpus    # false-positive run against known-honest repos (needs the internet)
pnpm test:sandbox   # proves the worker container cannot reach other hosts (needs Docker)
```

`dome sweep-remote --list repos.txt` is a private research tool: it reads public repositories through GitHub's read endpoints and writes a local file readable only by you. It never comments, opens issues or contacts anyone. Whether to tell a maintainer is a human decision.

See [`docs/writing-a-rule.md`](docs/writing-a-rule.md) for adding a rule, [`docs/rules/`](docs/rules/README.md) for per-rule reference pages, [`docs/api.md`](docs/api.md) for the REST API, [`docs/deployment.md`](docs/deployment.md) for running the service and [`docs/incident-response.md`](docs/incident-response.md) for what to do after a finding. See also [CONTRIBUTING.md](CONTRIBUTING.md). This repo has no `.vscode/tasks.json` and no install scripts, and it scans itself on every pull request (`.github/workflows/dome.yml`). Requiring that check on `main` is a repository setting a maintainer still has to turn on.

## Related repositories

dome-backend is one of three repositories in the Dome Security org. It owns detection and serving; the other two own the interface and the chain.

| Repository | Role | Direction |
|---|---|---|
| [`dome-frontend`](https://github.com/dome-security/dome-frontend) | The web app | Calls this repo's REST API |
| [`dome-contracts`](https://github.com/dome-security/dome-contracts) | The on-chain Dome Registry (Soroban) | Emits events this repo reads; accepts attestations this repo publishes |

**dome-frontend**

- *Receives from it:* HTTP requests to the API in `packages/server`: `POST /v1/scans` to start a scan, `GET /v1/scans/:id` to poll it, `GET /v1/repos/:owner/:repo` for a repo's latest verdict, and `GET /v1/indicators` and `GET /v1/indicators/:sha256` for registry indicators. Browser origins must be listed in `CORS_ORIGINS`.
- *Sends to it:* JSON scan results (verdict, findings, report hash) and indicator pages. Reasons in a result never quote text chosen by the scanned repo, so the frontend can render them without extra escaping logic for attacker-controlled prose.
- *Shared interface:* [`openapi.json`](openapi.json), generated from the route schemas (`pnpm openapi`; a test fails when it is stale), for a typed client, and [`packages/engine/rules.json`](packages/engine/rules.json), the rule catalogue (`id`, `level`, `title`, `description`, `docsUrl`) the frontend maps rule IDs to fixed text with. The prose is in [`docs/api.md`](docs/api.md). A change to a response shape is a breaking change for the frontend.

**dome-contracts**

- *Receives from it:* contract events, read through Stellar RPC by `packages/indexer` and decoded by `packages/registry-client`: `attest` and `retract_attest` (repo, commit, verdict, rules hash, report hash, attester), and `propose`, `approve` and `retract` (an indicator with its campaign and evidence). They are stored in PostgreSQL as an index; the chain stays the source of truth.
- *Sends to it:* `attest(attester, { repo, commit, verdict, scanner, rules, report })` invocations from the server, where `report` is the SHA-256 of the canonical JSON report and `rules` the hash of the rule set that produced it, so anyone can check a published verdict against a report. Workers never hold the signing key.
- *Shared interface:* the TypeScript bindings generated in `dome-contracts`, vendored unmodified in [`packages/registry-client/vendor`](packages/registry-client/vendor/README.md) with their commit and file hashes until the package is published. [`packages/registry-client`](packages/registry-client/src/schema.ts) wraps them and is the only place to adapt when the contract changes.

**Inside this repo**, approved registry indicators flow into the same `packages/intel` format the engine reads (`hash`, `marker`, `package`, `domain`). `dome intel update` fetches them from the API server (`--api` or `DOME_API_URL`), which serves what the indexer has read from the chain, so a registry approval changes detection without a release.

## Design principles

Dome reads untrusted repositories, so the engine is built to never become the attack path. Never execute: JSON with comments is parsed, not evaluated, and JS is tokenized, not run. Parsing is linear-time with no backtracking regular expressions on untrusted input, and a failed read is never "clean". Verdicts never repeat the repo's words, so a malicious repo cannot write "safe to install" into a warning a person or an AI agent will relay. Scans are deterministic and offline by default, and every report ends with: *"No known pattern found is not the same as safe."*

## Roadmap

Each milestone builds on the one before. Items marked *planned* do not exist yet.

- [x] **M1 Engine:** walker, git object reader, JSONC parser, finding model, text/JSON reporters, `autorun` rules
- [x] **M2 CLI + Action:** `dome scan`, `dome sweep`, `dome init`, `dome intel`, the GitHub Action with job summary and `report`/`enforce` modes
  - [ ] PR labels from the Action (*planned*)
  - [ ] The Action has no `config` input: `.dome.yml` is always read from the base commit so a pull request cannot loosen its own checks (intentional)
- [x] **M3 Payloads:** font header checks, JS tokenizer, config-tail detection, SARIF, fork-safe comment workflow
- [x] **M4 API + workers:** REST API, job queue, sandboxed workers, scan of public repos for the web app
- [x] **M5 Registry:** indexer, `registry-client`, `dome intel update`, attestation publishing
- [ ] **M6 GitHub App:** org-wide install, scheduled sweeps, force-push/unsigned-commit alerts
  - [x] Signed webhook intake: `pull_request` and default-branch `push` deliveries on public repos queue scans
  - [ ] GitHub App authentication, install flow and posting results back to GitHub (*planned*)
  - [ ] Private repositories (*planned*)
  - [ ] Scheduled org-wide sweeps (*planned*)
  - [ ] Force-push and unsigned-commit alerts (*planned*)
- [ ] **Release readiness**
  - [x] CI (lint, typecheck, tests with an engine coverage floor, action bundle diff-check, images, informational corpus and sandbox jobs, CodeQL, OpenSSF Scorecard, self-scan), actions pinned by SHA, `CODEOWNERS`, changesets and a changelog, one docs page per rule, and guides for rules, incident response, deployment and the API
  - [x] `openapi.json` and `rules.json` for `dome-frontend`; registry bindings from `dome-contracts` vendored
  - [ ] Branch rules on `main` (signed commits, required checks, code-owner review) and a maintainers team in `CODEOWNERS` (*maintainer action*)
  - [ ] Replace `REPLACE_WITH_RELEASE_SHA` in `packages/action/examples/` with the first release commit (*planned*)
  - [ ] Publish `@dome-security/registry-bindings`, then drop the vendored copy (*waiting on `dome-contracts`*)

## Security

Report vulnerabilities privately through **Report a vulnerability** on this repo; see [SECURITY.md](SECURITY.md). Do not open public issues for bypasses until a fix is released; we credit reporters. `main` is meant to require signed commits, block force-pushes, and require code-owner review for `.vscode/`, `.github/`, `package.json` and lockfiles; `CODEOWNERS` is in place, but the branch rules are repository settings that a maintainer still has to turn on, so until then this is intent, not enforcement. Never add real malware, real obfuscated payloads or live attacker URLs in an executable position: such PRs are closed and reported, and known-bad domains and hashes belong only in `packages/intel` data files.

## License

Apache-2.0. See [LICENSE](LICENSE).

## Acknowledgments

Built on public incident research: OpenSourceMalware's [PolinRider dossier and YARA rule](https://github.com/OpenSourceMalware/PolinRider), Microsoft's [report on malicious Next.js repositories](https://www.microsoft.com/en-us/security/blog/2026/02/24/c2-developer-targeting-campaign/), Abstract Security's [VS Code tasks infection vector analysis](https://www.abstract.security/blog/contagious-interview-tracking-the-vs-code-tasks-infection-vector), the [RMG-Py incident report](https://github.com/ReactionMechanismGenerator/RMG-Py/issues/3008), Socket's [GhostAction write-up](https://socket.dev/blog/ghostaction-cloud-credentials) and the [Stellar Light repo-security holds](https://github.com/Stellar-Light/stellarlight/pull/1833).
