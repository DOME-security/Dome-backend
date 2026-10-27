<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-STL-002: Code reads browser wallet extension storage

| Category | Default level |
|---|---|
| `stellar` | 🟠 review |

Code that reads browser wallet extension storage (Freighter and others) from a project file.

## Why it matters

Developer-targeting malware collects browser extension storage to steal wallet vaults, including Stellar wallets such as Freighter. Application code never needs to read another extension's storage from disk.

## What Dome reports

- Project code refers to browser extension storage, where wallet extensions keep their vaults.
- Project code refers to browser extension storage and also makes network requests.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Browser automation and extension development tooling.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [Microsoft: Developer-targeting campaign using malicious Next.js repositories](https://www.microsoft.com/en-us/security/blog/2026/02/24/c2-developer-targeting-campaign/)
- [Abstract Security: Tracking the VS Code tasks infection vector](https://www.abstract.security/blog/contagious-interview-tracking-the-vs-code-tasks-infection-vector)
