# Changesets

Every pull request that changes behaviour adds a changeset:

```bash
pnpm changeset
```

Pick the packages you changed and the bump (`patch`, `minor`, `major`), and
describe the change for a reader of the CHANGELOG. Docs-only, test-only and CI
changes do not need one.

Releases are cut by a maintainer with `pnpm release:version`, which also
regenerates everything derived from a version (the engine's `VERSION`,
`openapi.json` and the action bundle). Publishing to npm is a separate,
manual step; see CONTRIBUTING.md.
