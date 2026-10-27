<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-VSC-002: Automatic tasks turned on

| Category | Default level |
|---|---|
| `autorun` | 🟠 review |

Workspace settings set `task.allowAutomaticTasks` to `on`.

## Why it matters

VS Code asks before running a folder-open task for the first time. Setting `task.allowAutomaticTasks` to `on` in the workspace removes that prompt, which is what the RMG-Py attacker did alongside the malicious task.

## What Dome reports

- Turns on automatic tasks so VS Code does not ask first.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Rare. A project that wants its watch task to start silently might set it, but that choice belongs in each developer's user settings, not in the repository.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [RMG-Py incident report and hardening advice](https://github.com/ReactionMechanismGenerator/RMG-Py/issues/3008)
- [VS Code Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust)
