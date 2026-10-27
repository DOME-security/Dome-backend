<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-VSC-005: Task downloads and runs code

| Category | Default level |
|---|---|
| `autorun` | 🔴 block |

A task command downloads and pipes to a shell (`curl … | sh`, `wget … | bash`, PowerShell `iwr | iex`).

## Why it matters

Contagious Interview and Microsoft's Next.js report describe tasks that fetch a second stage from a staging server and run it in a shell. Nothing about the downloaded code is visible in the repository.

## What Dome reports

- A VS Code task downloads something from the network and runs it.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Setup tasks that install a toolchain with `curl | sh`. Those belong in documentation, not in a task that can run automatically.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [Abstract Security: Tracking the VS Code tasks infection vector](https://www.abstract.security/blog/contagious-interview-tracking-the-vs-code-tasks-infection-vector)
- [Microsoft: Developer-targeting campaign using malicious Next.js repositories](https://www.microsoft.com/en-us/security/blog/2026/02/24/c2-developer-targeting-campaign/)
