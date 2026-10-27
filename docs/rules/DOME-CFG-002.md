<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-CFG-002: Whitespace padding or very long line in source

| Category | Default level |
|---|---|
| `payload` | 🟠 review |

Very long lines or heavy whitespace padding in source and config files.

## Why it matters

Payloads appended to ordinary source files hide past the right edge of the editor or review pane. Minified bundles are expected to have long lines and are skipped by name.

## What Dome reports

- A source line has code pushed far to the right by a long run of whitespace.
- A source file that is otherwise readable has a single extremely long line.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Generated files committed without a `.min.js` name, and data embedded as a long string literal. Test files, dependency folders and build output are skipped.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [OpenSourceMalware: PolinRider dossier and YARA rule](https://github.com/OpenSourceMalware/PolinRider)
