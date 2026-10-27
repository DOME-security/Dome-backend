<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-GIT-001: .gitignore stops ignoring .vscode or .env

| Category | Default level |
|---|---|
| `autorun` | ⚪ info |

`.gitignore` change that stops ignoring `.vscode` or `.env`.

## Why it matters

In the RMG-Py incident and RitualPlay analysis, the attacker edited `.gitignore` so the malicious `.vscode` folder would be committed and pushed to other contributors.

## What Dome reports

- .gitignore explicitly re-includes .vscode or .env files.
- .gitignore no longer ignores .vscode or .env.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Teams that intentionally share `.vscode/settings.json` often un-ignore it. This rule is context only.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [RMG-Py incident report and hardening advice](https://github.com/ReactionMechanismGenerator/RMG-Py/issues/3008)
