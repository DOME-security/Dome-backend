<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-VSC-006: Task output hidden

| Category | Default level |
|---|---|
| `autorun` | ⚪ info |

Task options hide output (`presentation.reveal: never`, `presentation.echo: false`, `hide: true`) on a task that also runs on folder open or runs a payload.

## Why it matters

Malicious folder-open tasks set `reveal: never` so no terminal panel appears. On its own this is harmless; it is reported as context next to other task findings.

## What Dome reports

- The task hides its terminal output, so nothing is visible while it runs.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Background watch tasks often hide output. That is why this rule is only informational.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [Abstract Security: Tracking the VS Code tasks infection vector](https://www.abstract.security/blog/contagious-interview-tracking-the-vs-code-tasks-infection-vector)
- [OpenSourceMalware: PolinRider dossier and YARA rule](https://github.com/OpenSourceMalware/PolinRider)
