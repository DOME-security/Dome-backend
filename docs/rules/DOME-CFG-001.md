<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-CFG-001: Code after the module body in a config file

| Category | Default level |
|---|---|
| `payload` | 🟠 review |

Code after the module body in JS/TS config files, especially after a long run of whitespace.

## Why it matters

PolinRider and the Next.js campaign appended an obfuscated loader to `postcss.config.mjs`, `tailwind.config.js` and `next.config.*`, after `export default` and hundreds of spaces so it sits off-screen in editors and diffs. The build tool then runs it on every `npm run dev`.

## What Dome reports

- A config file has code after its export statement.
- A config file has code after its export statement, pushed out of view by a long run of whitespace.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Declarations after the export (helper functions, constants, more `module.exports` assignments) are ignored unless they are padded or build code at runtime. Other statements after the export are reported for review.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [OpenSourceMalware: PolinRider dossier and YARA rule](https://github.com/OpenSourceMalware/PolinRider)
- [Microsoft: Developer-targeting campaign using malicious Next.js repositories](https://www.microsoft.com/en-us/security/blog/2026/02/24/c2-developer-targeting-campaign/)
