<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-IOC-003: Known malicious npm package

| Category | Default level |
|---|---|
| `intel` | 🔴 block |

Dependencies on known malicious npm packages.

## Why it matters

PolinRider published look-alike packages such as `tailwindcss-style-animate` whose install scripts ran the loader. A dependency on one runs it on the next `npm install`, even if it was added deep in the lockfile.

## What Dome reports

- package.json depends on a package published as part of a known malware campaign.
- The lockfile resolves a package published as part of a known malware campaign.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

None: package names on the list are confirmed malicious.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception. Known-indicator findings cannot be lowered or allowed.

## References

- [OpenSourceMalware: PolinRider dossier and YARA rule](https://github.com/OpenSourceMalware/PolinRider)
