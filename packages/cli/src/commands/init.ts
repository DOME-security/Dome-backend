import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { UsageError, type Io } from '../io.js';

export const INIT_HELP = `Usage: dome init [--write] [--owner <@team>]

Prints the maintainer hardening checklist. With --write, also creates the
file-based parts in the current repository (never overwriting a file):

  .github/workflows/dome.yml   the Dome Action in report mode
  .dome.yml                    an empty configuration with comments
  .github/CODEOWNERS           auto-run paths owned by --owner (only with --owner)

Review the files, then open a pull request with them.
`;

export const CHECKLIST = `Dome hardening checklist

Rulesets on the default branch
  [ ] Require a pull request before merging
  [ ] Require the "dome / scan" status check
  [ ] Require signed commits
  [ ] Block force pushes and deletions

CODEOWNERS for auto-run paths
  [ ] /.vscode/ /.devcontainer/ /.github/ /.claude/ /.cursor/ /.mcp.json
      /package.json, lockfiles and /.gitignore

Organization
  [ ] Require 2FA
  [ ] Prefer short-lived fine-grained tokens
  [ ] Narrow any GitHub App that has access to all repositories
  [ ] Enable private vulnerability reporting and secret scanning

Every maintainer's editor
  [ ] Keep Workspace Trust on
  [ ] Set "task.allowAutomaticTasks": "off" in user settings
  [ ] Review contributor branches on GitHub or in a Codespace

Stellar Wave: run the Action in report mode before the Wave, fix what it
finds on main, then switch to enforce.
`;

const ACTIONS_CHECKOUT = 'actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2';

export const WORKFLOW = `name: dome
on:
  pull_request:          # never pull_request_target: PR code must not run with write access
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: ${ACTIONS_CHECKOUT}
        with:
          fetch-depth: 0
          persist-credentials: false
      # Pin to a release commit of dome-security/dome-backend.
      - uses: dome-security/dome-backend/packages/action@REPLACE_WITH_RELEASE_SHA
        with:
          mode: report         # switch to "enforce" once main is clean
`;

export const CONFIG = `# Dome configuration. In pull requests Dome reads this file from the base
# branch, so a change cannot loosen its own checks.

# Paths that hold intentional look-alikes (still scanned, reported as fixtures).
fixtures: []

# Hash-pinned exceptions: run \`dome scan . --explain\` to generate entries.
allow: []

# Raise (or lower) a rule's severity for this repository.
severity: {}
`;

const CODEOWNER_PATHS = [
  '/.vscode/',
  '/.devcontainer/',
  '/.github/',
  '/.claude/',
  '/.cursor/',
  '/.mcp.json',
  '/.gitignore',
  '/package.json',
  '/package-lock.json',
  '/pnpm-lock.yaml',
  '/yarn.lock',
];

async function exists(file: string): Promise<boolean> {
  return access(file).then(
    () => true,
    () => false,
  );
}

export async function runInit(args: string[], io: Io): Promise<number> {
  const { values } = parseArgs({
    args,
    options: {
      write: { type: 'boolean', default: false },
      owner: { type: 'string' },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });
  if (values.help) {
    io.stdout(INIT_HELP);
    return 0;
  }
  io.stdout(CHECKLIST);
  if (!values.write) return 0;
  if (values.owner !== undefined && !/^@[A-Za-z0-9-]+(?:\/[A-Za-z0-9._-]+)?$/.test(values.owner)) {
    throw new UsageError('--owner must be a GitHub @user or @org/team');
  }
  const files: [string, string][] = [
    ['.github/workflows/dome.yml', WORKFLOW],
    ['.dome.yml', CONFIG],
  ];
  if (values.owner) files.push(['.github/CODEOWNERS', `${CODEOWNER_PATHS.map((p) => `${p} ${values.owner}`).join('\n')}\n`]);
  io.stdout('\n');
  for (const [rel, content] of files) {
    const abs = path.join(io.cwd, rel);
    if (await exists(abs)) {
      io.stdout(`skipped ${rel} (already exists)\n`);
      continue;
    }
    await mkdir(path.dirname(abs), { recursive: true });
    await writeFile(abs, content, { flag: 'wx' });
    io.stdout(`wrote   ${rel}\n`);
  }
  io.stdout('\nReplace REPLACE_WITH_RELEASE_SHA with a Dome release commit, then open a pull request.\n');
  return 0;
}
