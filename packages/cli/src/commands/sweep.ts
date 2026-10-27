import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { cleanPath, FsSource, ruleLabel, scan, SEVERITY_ORDER, type ScanResult, type Verdict } from '@dome-security/engine';
import { loadIntel } from '@dome-security/intel';
import { UsageError, type Io } from '../io.js';

export const SWEEP_HELP = `Usage: dome sweep <folder> [--depth <n>]

Finds every git repository under a folder (for example your home directory)
and scans its working tree for auto-run files and payloads. Use it after an
incident to find other clones that carry the same files.

Options:
  --depth <n>   How many folder levels to search (default 6)
`;

const SKIP = new Set(['node_modules', 'Library', 'AppData', '.cache', '.npm', '.pnpm-store', '.Trash', 'proc', 'sys']);

/** Folders under `root` that contain a `.git` entry. Does not descend into a repository once found. */
export async function findRepositories(root: string, maxDepth: number): Promise<string[]> {
  const found: string[] = [];
  const queue: [string, number][] = [[root, 0]];
  while (queue.length > 0) {
    const [dir, depth] = queue.shift()!;
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
    if (entries.some((e) => e.name === '.git')) {
      found.push(dir);
      continue;
    }
    if (depth >= maxDepth) continue;
    for (const e of entries) {
      if (e.isDirectory() && !e.isSymbolicLink() && !SKIP.has(e.name) && !(e.name.startsWith('.') && e.name !== '.config')) {
        queue.push([path.join(dir, e.name), depth + 1]);
      }
    }
  }
  return found.sort();
}

const RANK: Record<Verdict, number> = { clean: 0, review: 1, incomplete: 2, block: 3 };

export async function runSweep(args: string[], io: Io): Promise<number> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: { depth: { type: 'string', default: '6' }, help: { type: 'boolean', short: 'h', default: false } },
  });
  if (values.help) {
    io.stdout(SWEEP_HELP);
    return 0;
  }
  if (positionals.length !== 1) throw new UsageError('dome sweep takes exactly one folder');
  const depth = Number(values.depth);
  if (!Number.isInteger(depth) || depth < 0 || depth > 20) throw new UsageError('--depth must be between 0 and 20');

  const root = path.resolve(io.cwd, positionals[0]!.replace(/^~(?=$|\/)/, io.env.HOME ?? '~'));
  const repos = await findRepositories(root, depth);
  const intel = await loadIntel();
  let worst: Verdict = 'clean';
  const counts: Record<Verdict, number> = { clean: 0, review: 0, block: 0, incomplete: 0 };
  for (const repo of repos) {
    let result: ScanResult;
    try {
      result = await scan({ source: new FsSource(repo), intel });
    } catch {
      result = { verdict: 'incomplete', findings: [] } as unknown as ScanResult;
    }
    counts[result.verdict]++;
    if (RANK[result.verdict] > RANK[worst]) worst = result.verdict;
    if (result.verdict === 'clean') continue;
    io.stdout(`${result.verdict.toUpperCase().padEnd(10)} ${cleanPath(path.relative(root, repo) || '.')}\n`);
    for (const f of result.findings.filter((x) => SEVERITY_ORDER[x.severity] >= SEVERITY_ORDER.review)) {
      const where = f.locations.map((l) => cleanPath(l.path)).join(', ');
      io.stdout(`           ${ruleLabel(f)}  ${where}\n`);
    }
  }
  io.stdout(
    `\nSwept ${repos.length} repositories: ${counts.block} block, ${counts.review} review, ${counts.incomplete} could not check, ${counts.clean} clean.\n`,
  );
  io.stdout('No known pattern found is not the same as safe.\n');
  return { clean: 0, review: 1, block: 2, incomplete: 3 }[worst];
}
