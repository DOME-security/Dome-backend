<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-GHA-001: Workflow added, changed or risky

| Category | Default level |
|---|---|
| `autorun` | 🟠 review |

New or changed workflow under `.github/workflows/`, weighted up for `pull_request_target`, secrets passed to `curl`/`wget`, or posting to raw IPs.

## Why it matters

GhostAction added workflows that read every repository secret and posted them to an attacker server. `pull_request_target` combined with a checkout of the pull request runs untrusted code with write access.

## What Dome reports

- A GitHub Actions workflow was added or changed.
- The workflow runs on pull_request_target, with write access and secrets, for pull requests from forks.
- The workflow runs on pull_request_target and checks out the pull request's own code.
- A workflow step sends repository secrets to a network tool.
- A workflow step contacts a raw IP address.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Every honest workflow change is reported for review in a diff scan. Deployment steps that pass a single secret to `curl` for an API call will also be flagged; check the destination.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [Socket: GhostAction workflow injection](https://socket.dev/blog/ghostaction-cloud-credentials)
- [GitHub Actions security hardening](https://docs.github.com/actions/security-guides/security-hardening-for-github-actions)
