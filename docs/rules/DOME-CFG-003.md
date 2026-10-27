<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-CFG-003: Runtime code construction in config or route code

| Category | Default level |
|---|---|
| `payload` | 🟠 review |

Runtime code construction (`eval`, `new Function`, `vm.runIn*`, detached hidden `child_process` spawns) in config or route files.

## Why it matters

Config files and server routes run with full privileges whenever the project builds or starts. Loaders decode a payload and run it with `eval` or `new Function`, or start a detached hidden process that outlives the dev server.

## What Dome reports

- A config or route file calls eval.
- A config or route file builds a function from a string with Function.
- A config or route file compiles and runs code with the vm module.
- A config or route file starts a detached, hidden background process.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Some build tooling evaluates code on purpose. Review the call and accept it with a hash-pinned `allow` entry.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [Microsoft: Developer-targeting campaign using malicious Next.js repositories](https://www.microsoft.com/en-us/security/blog/2026/02/24/c2-developer-targeting-campaign/)
- [OpenSourceMalware: PolinRider dossier and YARA rule](https://github.com/OpenSourceMalware/PolinRider)
