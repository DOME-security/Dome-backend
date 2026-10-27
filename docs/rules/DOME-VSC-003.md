<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-VSC-003: .vscode hidden from view

| Category | Default level |
|---|---|
| `autorun` | 🟠 review |

`files.exclude` or `search.exclude` hides `.vscode` or `tasks.json`.

## Why it matters

Hiding `.vscode` keeps a malicious task out of sight in the editor. The RMG-Py attacker added `files.exclude` entries for exactly this.

## What Dome reports

- Workspace settings hide the .vscode folder or tasks.json from the file explorer or search.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Some projects tidy the explorer by hiding editor folders. Hiding `.vscode` specifically is unusual.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [RMG-Py incident report and hardening advice](https://github.com/ReactionMechanismGenerator/RMG-Py/issues/3008)
