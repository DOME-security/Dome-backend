<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-ENV-001: Encoded URL in .env with code that sends the environment

| Category | Default level |
|---|---|
| `payload` | 🟠 review |

Base64-encoded URLs in `.env` files combined with code that sends `process.env` over the network.

## Why it matters

The malicious Next.js repositories Microsoft describes keep their C2 address base64-encoded in `.env` and add a backend route that posts the entire `process.env` (API keys, wallet keys, tokens) to it. Each half alone is a review; together they block.

## What Dome reports

- An environment file stores a URL encoded as base64.
- Code sends the whole process environment over the network.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Telemetry or crash reporters that send a full environment. That is a privacy problem in itself.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [Microsoft: Developer-targeting campaign using malicious Next.js repositories](https://www.microsoft.com/en-us/security/blog/2026/02/24/c2-developer-targeting-campaign/)
