<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-IOC-004: Known staging or C2 domain in an executable position

| Category | Default level |
|---|---|
| `intel` | 🔴 block |

Known staging and C2 domains in executable positions (tasks, scripts, hooks, workflows, config and route code).

## Why it matters

Loaders fetch their second stage from a small set of staging hosts. A known host in a task, script, hook or config file means the repository reaches out to attacker infrastructure.

## What Dome reports

- Code that runs automatically contacts a domain known to host malware or command-and-control servers.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

None for listed domains. Mentions in documentation are not scanned.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception. Known-indicator findings cannot be lowered or allowed.

## References

- [OpenSourceMalware: PolinRider dossier and YARA rule](https://github.com/OpenSourceMalware/PolinRider)
- [Microsoft: Developer-targeting campaign using malicious Next.js repositories](https://www.microsoft.com/en-us/security/blog/2026/02/24/c2-developer-targeting-campaign/)
