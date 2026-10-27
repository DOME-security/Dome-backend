<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-PRP-001: Propagation script rewrites history

| Category | Default level |
|---|---|
| `payload` | 🟠 review |

Propagation scripts that rewind the clock, amend the last commit and force-push.

## Why it matters

PolinRider spread with `temp_auto_push.bat`: it set the system clock back, amended the latest commit to include the payload and force-pushed, so the change appears in an old, already-reviewed commit.

## What Dome reports

- A script amends the last commit and force-pushes it.
- A script rewinds the clock, amends the last commit and force-pushes, hiding a change inside existing history.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Release helpers that amend and force-push to a personal branch. Rewinding the clock has no honest use here.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [OpenSourceMalware: PolinRider dossier and YARA rule](https://github.com/OpenSourceMalware/PolinRider)
- [RMG-Py incident report and hardening advice](https://github.com/ReactionMechanismGenerator/RMG-Py/issues/3008)
