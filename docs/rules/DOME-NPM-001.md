<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-NPM-001: Install script added or changed

| Category | Default level |
|---|---|
| `autorun` | 🟠 review |

`preinstall`, `install`, `postinstall` or `prepare` scripts added or changed (and `binding.gyp`, which npm builds on install).

## Why it matters

Install scripts run with the developer's privileges the moment someone types `npm install`. PolinRider shipped through packages such as `tailwindcss-style-animate` whose install hooks ran the loader.

## What Dome reports

- A package.json script that npm runs automatically on install was added or changed.
- A binding.gyp file makes npm run a native build on install.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Many honest packages use `prepare` to build or `postinstall` to set up git hooks. Read the command and check that it only runs tracked source or a known build output.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [npm scripts and lifecycle events](https://docs.npmjs.com/cli/v10/using-npm/scripts)
- [OpenSourceMalware: PolinRider dossier and YARA rule](https://github.com/OpenSourceMalware/PolinRider)
