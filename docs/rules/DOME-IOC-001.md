<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-IOC-001: Known-bad file hash

| Category | Default level |
|---|---|
| `intel` | 🔴 block |

File hashes on the known-bad list (synced from the Dome Registry and public advisories).

## Why it matters

Campaigns reuse the same loader files across many repositories. An exact hash match needs no interpretation, so it always blocks and cannot be lowered by `.dome.yml`.

## What Dome reports

- This file is byte-for-byte identical to a known malicious file.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

None: a match is the same bytes. If an indicator was listed by mistake, it is revoked in the Dome Registry.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception. Known-indicator findings cannot be lowered or allowed.

## References

- [OpenSourceMalware: PolinRider dossier and YARA rule](https://github.com/OpenSourceMalware/PolinRider)
