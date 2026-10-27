# Incident response for maintainers

What to do when Dome blocks a pull request, or when you find auto-run
malware in a repository you maintain. Work through the steps in order.

## 1. Stop it spreading

- **Do not check out the branch** in VS Code, Cursor, or a terminal where you
  might run `npm install`. Read the files on GitHub.
- **Do not merge** the pull request. If it is already merged, revert it on
  GitHub (Revert button) rather than locally.
- Tell other maintainers and active contributors not to pull until you have
  cleaned `main`.

## 2. Confirm what you are looking at

```bash
dome scan https://github.com/<owner>/<repo>                  # default branch
dome scan https://github.com/<owner>/<repo> --diff main...<sha>
```

`dome scan <url>` clones with `--no-checkout` into a temporary folder and
never runs anything. Look for:

- `.vscode/tasks.json` with `runOn: folderOpen`, especially running `node` on
  a font or image (DOME-VSC-001, DOME-VSC-004)
- `.vscode/settings.json` turning on automatic tasks or hiding `.vscode`
  (DOME-VSC-002, DOME-VSC-003)
- fonts that are not fonts (DOME-AST-001), config files with code after the
  export (DOME-CFG-001), install scripts (DOME-NPM-001/002)
- new workflows that read secrets (DOME-GHA-001)

## 3. If anyone opened or installed it

Treat that machine as compromised. From a **different, clean** machine:

1. Revoke and rotate GitHub tokens, SSH keys, npm tokens and cloud
   credentials that were on the affected machine.
2. **Move funds** from any Stellar account whose secret key was on that
   machine. Stellar CLI identities are plaintext TOML unless created with
   `--secure-store`; browser wallet vaults (Freighter and others) should be
   treated as exposed.
3. Review your GitHub security log and recent pushes for commits you did not
   make, especially force pushes and unsigned commits.

Then rebuild or reimage the affected machine.

## 4. Clean the repository

- Remove the malicious files in a normal reviewed commit.
- Check other branches and forks: `dome sweep ~` scans every repository you
  have cloned.
- If history was rewritten (a clock-rewinding amend and force-push, see
  DOME-PRP-001), compare with an older clone or the GitHub activity log.

## 5. Harden

Run `dome init` and work through the checklist: rulesets requiring the
`dome / scan` check, signed commits, blocked force pushes, CODEOWNERS for
auto-run paths, and `"task.allowAutomaticTasks": "off"` in every maintainer's
user settings.

## 6. Report it

- Report the indicators (file hashes, package names, staging domains) so they
  can be approved on the Dome Registry and blocked everywhere.
- Report malicious npm packages to npm and malicious accounts to GitHub.
- For Stellar Wave repositories, tell the Drips team so affected issues can be
  resolved without costing honest contributors their Points.
