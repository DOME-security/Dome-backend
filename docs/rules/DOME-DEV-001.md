<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-DEV-001: Dev container lifecycle command

| Category | Default level |
|---|---|
| `autorun` | 🟠 review |

`.devcontainer/devcontainer.json` `initializeCommand`, `onCreateCommand`, `postCreateCommand`, `postStartCommand` or `postAttachCommand` added or changed.

## Why it matters

Dev container hooks run without a prompt when someone opens the repository in a container or a Codespace. `initializeCommand` is the most sensitive: it runs on the host, with access to the developer's keys and wallets.

## What Dome reports

- The initializeCommand hook runs on the host machine, outside the container, before the container starts.
- A dev container command runs automatically when the container is created, started or attached.
- A dev container command downloads and runs code, or runs a file that is not a script with Node.
- A dev container command downloads a script pinned to an exact commit and runs it.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Most dev containers run `npm ci` or similar in `postCreateCommand`. Review the command when it is added or changed. A script downloaded from `raw.githubusercontent.com` at a full commit SHA is reviewed rather than blocked, because it cannot change after review; anyone can pin a commit in their own repository, so check whose it is.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [Dev Container metadata reference](https://containers.dev/implementors/json_reference/)
- [Microsoft: Developer-targeting campaign using malicious Next.js repositories](https://www.microsoft.com/en-us/security/blog/2026/02/24/c2-developer-targeting-campaign/)
