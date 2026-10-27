import type { ScanResult, Severity } from '../types.js';
import { cleanPath, counts, HONESTY_NOTICE, locationLabel, ruleLabel } from './common.js';

const COLORS: Record<Severity | 'reset' | 'dim', string> = {
  block: '\u001b[31;1m',
  review: '\u001b[33;1m',
  info: '\u001b[37m',
  dim: '\u001b[2m',
  reset: '\u001b[0m',
};

const VERDICT_LABEL = {
  clean: 'CLEAN (no known pattern found)',
  review: 'REVIEW REQUIRED',
  block: 'BLOCK',
  incomplete: 'COULD NOT CHECK every file',
} as const;

export interface TextOptions {
  color?: boolean;
  /** Include info-level findings (hidden by default). */
  verbose?: boolean;
}

export function formatText(result: ScanResult, options: TextOptions = {}): string {
  const c = (key: keyof typeof COLORS, s: string) => (options.color ? `${COLORS[key]}${s}${COLORS.reset}` : s);
  const lines: string[] = [];
  lines.push(
    c('dim', `dome ${result.tool.version}: ${cleanPath(result.target)} (${result.scope} scan, ${result.stats.filesInScope} files)`),
    '',
  );
  const shown = result.findings.filter((f) => options.verbose || f.severity !== 'info');
  for (const f of shown) {
    const tag = f.fixture ? ' [fixture]' : f.allowed ? ' [allowed]' : '';
    lines.push(`${c(f.severity, f.severity.toUpperCase().padEnd(6))}  ${ruleLabel(f)}${tag}`);
    lines.push(`        ${f.reason}`);
    for (const loc of locationLabel(f)) lines.push(`        ${c('dim', loc)}`);
    lines.push('');
  }
  if (result.incomplete.length > 0) {
    lines.push('Could not check:');
    for (const i of result.incomplete) lines.push(`  ${cleanPath(i.path)} (${i.reason})`);
    lines.push('');
  }
  const n = counts(result);
  const verdictKey = result.verdict === 'clean' ? 'info' : result.verdict === 'incomplete' ? 'review' : result.verdict;
  lines.push(`${c(verdictKey, `Verdict: ${VERDICT_LABEL[result.verdict]}`)} (${n.block} block, ${n.review} review, ${n.info} info)`);
  lines.push(HONESTY_NOTICE);
  return `${lines.join('\n')}\n`;
}
