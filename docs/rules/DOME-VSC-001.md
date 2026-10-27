<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-VSC-001: Task runs on folder open

| Category | Default level |
|---|---|
| `autorun` | 🟠 review |

A `.vscode/tasks.json` or `*.code-workspace` task sets `runOptions.runOn` to `folderOpen`.

## Why it matters

A folder-open task runs as soon as someone opens the repository in VS Code or Cursor and trusts the workspace. It was the entry point in PolinRider/TasksJacker, Contagious Interview and the RMG-Py incident, where the task launched a script disguised as a font.

## What Dome reports

- A VS Code task is set to run automatically when the folder is opened.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Watch tasks (`tsc --watch`, `npm run dev`) are sometimes set to start on folder open. Review the command; if it only runs project code, accept it with a hash-pinned `allow` entry.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [Abstract Security: Tracking the VS Code tasks infection vector](https://www.abstract.security/blog/contagious-interview-tracking-the-vs-code-tasks-infection-vector)
- [OpenSourceMalware: PolinRider dossier and YARA rule](https://github.com/OpenSourceMalware/PolinRider)
- [RMG-Py incident report and hardening advice](https://github.com/ReactionMechanismGenerator/RMG-Py/issues/3008)
- [VS Code Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust)
