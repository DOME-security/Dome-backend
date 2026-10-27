<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-AST-001: Font file is not a font

| Category | Default level |
|---|---|
| `payload` | 🟠 review |

A file with a font extension whose bytes are not a real font (checked by format header fields, not just magic bytes).

## Why it matters

PolinRider, GhostAction and the RMG-Py attacker stored their obfuscated JavaScript loader as `public/fonts/fa-solid-*.woff2`. Nobody reviews binary-looking assets in a diff, and the file is later run with `node`. Combined with any auto-run surface in the same change, this becomes a block.

## What Dome reports

- A file named like a font does not have a valid font header.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Corrupt or truncated font files. Git LFS pointer files are recognized and skipped.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [OpenSourceMalware: PolinRider dossier and YARA rule](https://github.com/OpenSourceMalware/PolinRider)
- [RMG-Py incident report and hardening advice](https://github.com/ReactionMechanismGenerator/RMG-Py/issues/3008)
