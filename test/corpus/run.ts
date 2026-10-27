/**
 * False-positive run: shallow-clones every repository in repos.json and
 * scans it. Exits non-zero if any honest repository would be blocked or could
 * not be checked. Review-level findings are printed for triage.
 *
 *   pnpm test:corpus            # all repositories
 *   pnpm test:corpus chalk      # only URLs containing "chalk"
 */
import { readFileSync } from 'node:fs';
import { cloneRepo, GitTreeSource, ruleLabel, scan, type ScanResult } from '@dome-security/engine';
import { bundledIndicators, toIntelSet } from '@dome-security/intel';

interface Corpus {
  repos: { url: string; why: string }[];
}

const corpus = JSON.parse(readFileSync(new URL('./repos.json', import.meta.url), 'utf8')) as Corpus;
const filter = process.argv[2];
const intel = toIntelSet(bundledIndicators());
let failures = 0;

for (const { url } of corpus.repos.filter((r) => !filter || r.url.includes(filter))) {
  let result: ScanResult | undefined;
  const clone = await cloneRepo(url, { depth: 1 }).catch((e: Error) => {
    process.stdout.write(`ERROR   ${url}: clone failed (${e.message})\n`);
    failures++;
    return undefined;
  });
  if (!clone) continue;
  try {
    result = await scan({ source: new GitTreeSource(clone.dir, 'HEAD', url), intel });
  } finally {
    await clone.dispose();
  }
  const bad = result.verdict === 'block' || result.verdict === 'incomplete';
  if (bad) failures++;
  process.stdout.write(`${result.verdict.toUpperCase().padEnd(10)} ${url} (${result.stats.filesInTree} files)\n`);
  for (const f of result.findings.filter((x) => x.severity !== 'info')) {
    const where = f.locations.map((l) => `${l.path}${l.line ? `:${l.line}` : ''}`).join(', ');
    process.stdout.write(`  ${f.severity.padEnd(6)} ${ruleLabel(f)}  ${where}\n`);
  }
  for (const i of result.incomplete) process.stdout.write(`  not checked: ${i.path} (${i.reason})\n`);
}

process.stdout.write(failures ? `\n${failures} honest repositories were blocked or could not be checked.\n` : '\nNo false blocks.\n');
process.exitCode = failures ? 1 : 0;
