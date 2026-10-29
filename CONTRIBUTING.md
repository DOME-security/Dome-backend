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

`pnpm test:corpus` runs the false-positive check against known-honest repos. `pnpm test:sandbox` (Docker and internet) proves the worker container cannot reach hosts other than GitHub. `pnpm dev:server` starts the API on :8080 with a local PostgreSQL.

## Pull requests

- Use [Conventional Commits](https://www.conventionalcommits.org/), one per logical change, and sign your commits (`main` requires signatures).
- Every PR needs tests. Fixtures must be inert look-alikes, never working malware.
- A new rule needs a rule file with fixtures and tests, and a regenerated docs page (`pnpm docs:rules`). See [docs/writing-a-rule.md](docs/writing-a-rule.md).
- A rule change needs a `pnpm test:corpus` run showing no new false blocks.
- A new endpoint needs route schemas, an entry in [docs/api.md](docs/api.md), and a regenerated `openapi.json` (`pnpm openapi`).
- A change to behaviour needs a changeset (`pnpm changeset`); see [.changeset/README.md](.changeset/README.md).
- Known-bad hashes, domains and packages belong only in `packages/intel` data files.

## What gets a PR closed

Real malware, real obfuscated payloads, or live attacker URLs in an executable position. Such PRs are closed and reported.

## Design constraints

The engine reads untrusted repositories, so it must never execute, evaluate or `require` scanned content, must parse in linear time (no backtracking regular expressions on untrusted input), must never treat a failed read as clean, and must never quote text chosen by the scanned repo in a verdict.

## Releasing (maintainers)

1. `pnpm release:version` applies the pending changesets, then regenerates the engine `VERSION`, `openapi.json`, the rule docs and the committed action bundle. Review and commit the result.
2. Tag `vX.Y.Z`. The `release-action` workflow builds the bundle on a release commit and prints the SHA that workflows should pin.
3. Publishing packages to npm is deliberately manual: run `pnpm changeset publish` from a clean checkout with an npm token that is not stored in this repository.
