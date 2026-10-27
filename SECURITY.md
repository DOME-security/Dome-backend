# Security policy

## Reporting a vulnerability

Use **Report a vulnerability** on this repository's Security tab to report privately. Please do not open public issues or pull requests for vulnerabilities, scanner bypasses or false-negative evasions until a fix is released. We credit reporters who want credit.

Useful reports include a way to make the engine execute scanned content, a parser input that hangs or blows up memory, a repository that scans as clean while containing a known pattern, a verdict that repeats attacker-chosen text, and any way for a scanned repository to reach credentials or the network from a worker.

## Scope

In scope: the engine, CLI, GitHub Action, API server, workers and indexer in this repository.

Out of scope: the web app (`dome-frontend`) and the on-chain registry (`dome-contracts`); report those in their own repositories.

## Repository protections

`main` requires signed commits, blocks force-pushes, and requires code-owner review for `.vscode/`, `.github/`, `package.json` and lockfiles. This repo has no install scripts and scans itself on every pull request.

## Malicious content

Never submit real malware, real obfuscated payloads or live attacker URLs in an executable position. Such PRs are closed and reported.
