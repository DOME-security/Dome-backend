<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-STL-001: Code reads Stellar CLI identities

| Category | Default level |
|---|---|
| `stellar` | 🟠 review |

Code that reads Stellar CLI identities (`~/.config/stellar/identity/*.toml`, plaintext unless created with `--secure-store`).

## Why it matters

Stellar CLI identities are stored as plaintext TOML files containing secret keys unless created with `--secure-store`. A project file has no reason to read them, and code that reads them and talks to the network can drain accounts.

## What Dome reports

- Project code refers to the Stellar CLI identity folder, where secret keys are stored.
- Project code refers to the Stellar CLI identity folder and also makes network requests.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Stellar developer tooling that manages identities on purpose.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [Stellar CLI key storage](https://developers.stellar.org/docs/tools/cli/agent-cli/reference/architecture)
