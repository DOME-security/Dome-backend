# Dome GitHub Action

Runs the Dome engine on pull requests and pushes. It reads the change as git
objects, grades what it finds, writes a job summary and annotations, and fails
the check on **block** in `enforce` mode. It never runs anything from the
repository.

## Usage

```yaml
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
  with:
    fetch-depth: 0            # the base commit is needed for diff scans
    persist-credentials: false
- uses: dome-security/dome-backend/packages/action@<release-sha>
  with:
    mode: enforce
```

Then make `dome / scan` a **required** check in **Settings → Rules → Rulesets**.

Ready-to-copy workflows are in [`examples/`](examples):

| File | Purpose |
|---|---|
| `dome.yml` | The scan on `pull_request` and `push`, read-only permissions |
| `dome-sarif.yml` | The same, plus upload to GitHub code scanning |
| `dome-comment.yml` | A `workflow_run` workflow that comments on fork pull requests without checking them out |

## Inputs

| Input | Default | Meaning |
|---|---|---|
| `mode` | `enforce` | `enforce` fails on **block** (and on "could not check"); `report` never fails |
| `fail-on` | `block` | Set to `review` for repos that should never gain auto-run files |
| `scope` | `diff` | `diff` scans changed files and what they reference; `full` scans the whole tree |
| `sarif` | `false` | Upload results to code scanning (needs `security-events: write`) |
| `comment` | `false` | Post or update a single report comment (needs `pull-requests: write`) |
| `pull-request` | | Scan this pull request by number (for `workflow_run`); its head is fetched as objects only |
| `expected-head-sha` | | With `pull-request`, refuse to scan if the head moved |
| `token` | `github.token` | Used for SARIF upload, comments and pull request lookups |

## Outputs

`verdict` (`clean`, `review`, `block` or `incomplete`), and `report-json`,
`report-markdown`, `report-sarif` paths under `$RUNNER_TEMP/dome/`.

## How the Action stays safe

- Runs on `pull_request`, never `pull_request_target`, with `contents: read`.
- `.dome.yml` is read from the base commit, so a pull request cannot add
  exceptions for itself.
- The engine reads git objects; it never checks out, installs or runs PR code,
  and every git call disables hooks, fsmonitor and external diff programs.
- Dependencies are bundled into `dist/index.js` at release; nothing is
  installed at run time. Third-party actions in the examples are pinned by SHA.
- File names are escaped in annotations, so a crafted path cannot inject
  workflow commands.

A pull request can edit the workflow that runs on itself. Make `dome / scan`
required through a ruleset that names this workflow from the default branch,
or use an organization-level required workflow, so the check cannot be
switched off from inside the pull request.

## Building

```bash
pnpm --filter @dome-security/action bundle   # writes dist/index.js
```

Releases are built from signed tags and the bundle is committed only on the
release commit that workflows pin to.
