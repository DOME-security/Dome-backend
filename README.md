# dome-backend

**Auto-run malware detection for open-source repositories.**

dome-backend holds everything in Dome that scans and serves: the detection engine and rules, the `dome` CLI, the GitHub Action, the API server and GitHub App, sandboxed scan workers, and the registry indexer. Dome finds code a repository will run without asking (VS Code tasks, npm install hooks, dev container commands, AI-agent hooks, GitHub workflows, payloads hidden in config files or fake fonts) and tells you which of those look like a known attack. It reads files as text and bytes. It never executes them.

Part of the Dome Security GitHub org, alongside `dome-frontend` (the web app) and `dome-contracts` (the on-chain Dome Registry). Built for the Stellar Wave Program on Drips, after auto-run attacks reached several Wave repositories through merged pull requests in October 2026.

---

## What it does

- **Auto-run surface detection:** flags `.vscode/tasks.json` tasks with `runOn: folderOpen`, `task.allowAutomaticTasks: on`, `.vscode` hidden by `files.exclude`, npm `preinstall`/`postinstall`/`prepare` scripts, dev container commands, AI agent hooks (`.claude/`, `.cursor/`, `.mcp.json`), new or changed GitHub workflows, `.gitignore` changes and committed git hooks (`DOME-VSC-*`, `DOME-NPM-*`, `DOME-DEV-*`, `DOME-AGT-*`, `DOME-GHA-*`, `DOME-GIT-*`).
- **Payload detection:** fake fonts checked by format header fields rather than magic bytes, assets referenced from execution positions, code appended after the module body in JS/TS config files, heavy whitespace padding, runtime code construction (`eval`, `new Function`, `vm.runIn*`), `.env` exfiltration and clock-rewinding force-push propagation scripts (`DOME-AST-*`, `DOME-CFG-*`, `DOME-ENV-*`, `DOME-PRP-*`).
- **Known indicators and Stellar-specific rules:** known-bad file hashes, published campaign markers, malicious npm packages and C2 domains, kept in `packages/intel` data files so they update without a release (`DOME-IOC-*`); plus code that reads Stellar CLI identities or browser wallet storage, and committed Stellar secret keys (`DOME-STL-*`).
- **Graded verdicts, not alarm floods:** 🔴 **block** for payloads and indicator matches (fails the check), 🟠 **review** when an auto-run surface is added or changed, ⚪ **info** for context. Combinations escalate: `DOME-VSC-001` alone is review; with `DOME-AST-001` in the same change it is block. Reasons never quote text chosen by the scanned repo.
- **Three ways to scan:** the `dome` CLI (`dome scan`, `dome sweep`, `dome intel update`, `dome init`) with text, JSON, SARIF and Markdown output; a fork-safe GitHub Action (`pull_request` only, `contents: read`, `report` or `enforce` mode); and a REST API plus org-wide GitHub App that power `dome-frontend` and run scheduled sweeps.
- **Per-repo configuration:** an optional `.dome.yml` marks fixtures, accepts a reviewed task by content hash and raises severities. It can never lower a block caused by a known indicator.

## Status

Pre-alpha. Milestones M1 to M5 are implemented: the engine with 27 rules, the CLI, the GitHub Action, the API server, scan workers and the registry indexer. M6 (the org-wide GitHub App) is partly done; see [Roadmap](#roadmap). The registry contract schema in `packages/registry-client` is assumed and still has to be checked against `dome-contracts`. Rule behaviour is documented in [`docs/rules/`](docs/rules/README.md).

## Architecture

```
packages/
├── engine/           File walker, git object reader, parsers, rules, grading (no network, no exec)
│   ├── parsers/      jsonc, package.json, devcontainer, workflow YAML, JS tokenizer, font headers
│   ├── rules/        One file per rule, each with fixtures and tests
│   └── report/       text, json, sarif, markdown reporters
├── intel/            Versioned indicator data (hashes, packages, domains, markers) + loader
├── cli/              `dome scan`, `dome sweep`, `dome intel`, `dome init`
├── action/           The GitHub Action (bundled; used as dome-security/dome-backend/packages/action@<sha>)
├── server/           Fastify REST API + GitHub App webhooks
├── worker/           Sandboxed scan workers pulling jobs from a queue
├── indexer/          Follows Dome Registry contract events into PostgreSQL
└── registry-client/  Thin wrapper over the bindings generated in dome-contracts

test/
├── fixtures/         INERT look-alikes only, one folder per scenario
└── corpus/           Known-honest public repos used for false-positive runs

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
- **API**: Fastify REST API (`/v1/scans`, `/v1/repos`, `/v1/indicators`, `/v1/webhooks/github`) and a GitHub App
- **Workers**: Docker containers, unprivileged with a read-only root filesystem, no credentials and network access only to GitHub
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
pnpm test:corpus    # false-positive run against known-honest repos
```

See [`docs/writing-a-rule.md`](docs/writing-a-rule.md) for adding a rule, [`docs/rules/`](docs/rules/README.md) for per-rule reference pages, [`docs/api.md`](docs/api.md) for the REST API, [`docs/deployment.md`](docs/deployment.md) for running the service and [`docs/incident-response.md`](docs/incident-response.md) for what to do after a finding. See also [CONTRIBUTING.md](CONTRIBUTING.md). This repo has no `.vscode/tasks.json`, no install scripts, and its own `dome / scan` check is required on `main`.

## Design principles

Dome reads untrusted repositories, so the engine is built to never become the attack path. Never execute: JSON with comments is parsed, not evaluated, and JS is tokenized, not run. Parsing is linear-time with no backtracking regular expressions on untrusted input, and a failed read is never "clean". Verdicts never repeat the repo's words, so a malicious repo cannot write "safe to install" into a warning a person or an AI agent will relay. Scans are deterministic and offline by default, and every report ends with: *"No known pattern found is not the same as safe."*

## Roadmap

Each milestone builds on the one before. Summary:

- [x] **M1 Engine:** walker, git object reader, JSONC parser, finding model, text/JSON reporters, `autorun` rules
- [x] **M2 CLI + Action:** `dome scan`, the GitHub Action with job summary, labels, `report`/`enforce` modes (PR labels are not done yet)
- [x] **M3 Payloads:** font header checks, JS tokenizer, config-tail detection, SARIF, fork-safe comment workflow
- [x] **M4 API + workers:** REST API, job queue, sandboxed workers, scan of public repos for the web app
- [x] **M5 Registry:** indexer, `registry-client`, `dome intel update`, attestation publishing
- [ ] **M6 GitHub App:** org-wide install, scheduled sweeps, force-push/unsigned-commit alerts (private repos, scheduled sweeps and alerts are not done yet)

## Security

Report vulnerabilities privately through **Report a vulnerability** on this repo; see [SECURITY.md](SECURITY.md). Do not open public issues for bypasses until a fix is released; we credit reporters. `main` requires signed commits, blocks force-pushes, and requires code-owner review for `.vscode/`, `.github/`, `package.json` and lockfiles. Never add real malware, real obfuscated payloads or live attacker URLs in an executable position: such PRs are closed and reported, and known-bad domains and hashes belong only in `packages/intel` data files.

## License

Apache-2.0 (proposed).

## Acknowledgments

Built on public incident research: OpenSourceMalware's [PolinRider dossier and YARA rule](https://github.com/OpenSourceMalware/PolinRider), Microsoft's [report on malicious Next.js repositories](https://www.microsoft.com/en-us/security/blog/2026/02/24/c2-developer-targeting-campaign/), Abstract Security's [VS Code tasks infection vector analysis](https://www.abstract.security/blog/contagious-interview-tracking-the-vs-code-tasks-infection-vector), the [RMG-Py incident report](https://github.com/ReactionMechanismGenerator/RMG-Py/issues/3008), Socket's [GhostAction write-up](https://socket.dev/blog/ghostaction-cloud-credentials) and the [Stellar Light repo-security holds](https://github.com/Stellar-Light/stellarlight/pull/1833).
