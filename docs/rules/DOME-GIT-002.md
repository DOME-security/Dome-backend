<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-GIT-002: Git hooks committed to the repository

| Category | Default level |
|---|---|
| `autorun` | 🟠 review |

Git hooks committed to the repo (`.husky/`, `.githooks/`, `simple-git-hooks`) or a `core.hooksPath` setting.

## Why it matters

Hooks committed to the repository are installed by `npm install` (husky, simple-git-hooks) or by `core.hooksPath`, then run on every commit, checkout or push. A changed hook is an easy place to hide a payload.

## What Dome reports

- A git hook is committed to the repository and runs on commits, checkouts or pushes once installed.
- A script or config points git at hooks inside the repository with core.hooksPath.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Husky and lint-staged setups are common and honest. Review hook changes like any other auto-run file.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [RMG-Py incident report and hardening advice](https://github.com/ReactionMechanismGenerator/RMG-Py/issues/3008)
