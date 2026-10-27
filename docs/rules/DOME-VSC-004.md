<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-VSC-004: Task runs a non-script file with Node

| Category | Default level |
|---|---|
| `autorun` | 🔴 block |

A task command runs a font, image or other non-script file with `node` (string or array form, `sh -c`, `-r`/`--import`, stdin).

## Why it matters

Legitimate tasks run JavaScript files. Running `node` on a `.woff2`, `.png` or similar is how PolinRider, GhostAction and the RMG-Py attacker hid their loader: the "font" is really obfuscated JavaScript.

## What Dome reports

- A VS Code task runs a file that is not a script (such as a font or image) with Node.
- A VS Code task runs an npm script that runs a file that is not a script with Node.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

None known. Node has no reason to execute an asset file.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [OpenSourceMalware: PolinRider dossier and YARA rule](https://github.com/OpenSourceMalware/PolinRider)
- [RMG-Py incident report and hardening advice](https://github.com/ReactionMechanismGenerator/RMG-Py/issues/3008)
- [Abstract Security: Tracking the VS Code tasks infection vector](https://www.abstract.security/blog/contagious-interview-tracking-the-vs-code-tasks-infection-vector)
