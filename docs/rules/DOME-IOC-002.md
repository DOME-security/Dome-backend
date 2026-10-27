<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-IOC-002: Published campaign marker

| Category | Default level |
|---|---|
| `intel` | 🔴 block |

Published campaign markers (for example the signatures in OpenSourceMalware's PolinRider YARA rule).

## Why it matters

Obfuscated loaders change their hash on every copy but keep distinctive strings. Markers come from public research and live in `packages/intel` data files, never in rule code.

## What Dome reports

- This file contains a byte sequence published as a marker of a known malware campaign.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Security research repositories that store samples or YARA rules. Mark those paths as `fixtures`; indicator findings still block, so keep samples out of scanned repositories.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception. Known-indicator findings cannot be lowered or allowed.

## References

- [OpenSourceMalware: PolinRider dossier and YARA rule](https://github.com/OpenSourceMalware/PolinRider)
