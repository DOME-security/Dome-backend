<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-STL-003: Hard-coded Stellar secret key

| Category | Default level |
|---|---|
| `stellar` | 🟠 review |

Hard-coded Stellar secret keys (`S…` strkeys with a valid checksum) committed to the repo.

## Why it matters

Anyone who can read the repository can sign for the account. Only candidates with a valid SEP-23 checksum are reported, so random 56-character strings do not match.

## What Dome reports

- A Stellar secret key is committed to the repository.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Throwaway testnet keys in examples. Generate them at runtime instead of committing them.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [SEP-23: Strkey encoding](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0023.md)
