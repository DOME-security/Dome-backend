<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-AST-002: Asset in an execution position

| Category | Default level |
|---|---|
| `payload` | 🔴 block |

An image or font asset referenced from an execution position (npm script, dev container hook, workflow step, shell script, `fork`, or read and evaluated).

## Why it matters

Assets are never code. When something hands an asset to Node, or reads one and passes it to `eval`, `new Function` or `vm`, the asset is a disguised payload. VS Code tasks are covered by DOME-VSC-004.

## What Dome reports

- A script or hook runs an image, font or other non-script file with Node.
- Code starts a new Node process from an image or font file.
- Code reads an image or font file and builds code from it at runtime.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

None known.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [OpenSourceMalware: PolinRider dossier and YARA rule](https://github.com/OpenSourceMalware/PolinRider)
- [Microsoft: Developer-targeting campaign using malicious Next.js repositories](https://www.microsoft.com/en-us/security/blog/2026/02/24/c2-developer-targeting-campaign/)
