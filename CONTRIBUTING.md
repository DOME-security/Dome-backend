# Contributing to dome-backend

Contributions come through the Stellar Wave Program on Drips. Find an issue labelled `Stellar Wave`, apply in the [Drips Wave app](https://www.drips.network/wave) and wait to be assigned before starting. See the [Drips Wave Terms and Rules](https://docs.drips.network/wave/terms-and-rules).

## Setup

Requirements: Node 22+, pnpm, Docker (for PostgreSQL and workers).

```bash
pnpm install --ignore-scripts   # this repo never relies on install scripts
pnpm build
pnpm lint
pnpm test
```

`pnpm test:corpus` runs the false-positive check against known-honest repos. `pnpm dev:server` starts the API on :8080 with a local PostgreSQL.

## Pull requests

- Use [Conventional Commits](https://www.conventionalcommits.org/), one per logical change, and sign your commits (`main` requires signatures).
- Every PR needs tests. Fixtures must be inert look-alikes, never working malware.
- A new rule needs a rule file with fixtures and tests, and a regenerated docs page (`pnpm docs:rules`). See [docs/writing-a-rule.md](docs/writing-a-rule.md).
- A rule change needs a `pnpm test:corpus` run showing no new false blocks.
- A new endpoint needs an entry in [docs/api.md](docs/api.md).
- Known-bad hashes, domains and packages belong only in `packages/intel` data files.

## What gets a PR closed

Real malware, real obfuscated payloads, or live attacker URLs in an executable position. Such PRs are closed and reported.

## Design constraints

The engine reads untrusted repositories, so it must never execute, evaluate or `require` scanned content, must parse in linear time (no backtracking regular expressions on untrusted input), must never treat a failed read as clean, and must never quote text chosen by the scanned repo in a verdict.
