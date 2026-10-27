import type { Finding, ScanResult } from '../types.js';
import { cleanPath, counts, HONESTY_NOTICE, ruleDocUrl } from './common.js';

const ICON = { block: '🔴', review: '🟠', info: '⚪' } as const;
const MAX_ROWS = 100;

/** Escapes text for an HTML context inside a Markdown table cell. */
function cell(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '&#124;').replace(/\n/g, ' ');
}

function files(f: Finding): string {
  const unique = [...new Set(f.locations.map((l) => cleanPath(l.path)))];
  return unique.map((p) => `<code>${cell(p)}</code>`).join(', ');
}

function rules(f: Finding): string {
  return [...f.relatedRules, f.ruleId].map((id) => `[${id}](${ruleDocUrl(id)})`).join(' + ');
}

function table(findings: Finding[]): string[] {
  const rows = ['| Level | Rule | File | Why |', '|---|---|---|---|'];
  for (const f of findings.slice(0, MAX_ROWS)) {
    const tag = f.fixture ? ' (fixture)' : f.allowed ? ' (allowed)' : '';
    rows.push(`| ${ICON[f.severity]} ${f.severity}${tag} | ${rules(f)} | ${files(f)} | ${cell(f.reason)} |`);
  }
  if (findings.length > MAX_ROWS) rows.push(`| | | | ${findings.length - MAX_ROWS} more findings not shown |`);
  return rows;
}

function headline(result: ScanResult): string {
  const n = counts(result);
  switch (result.verdict) {
    case 'block':
      return `### 🔴 Dome: merge blocked (${n.block} ${n.block === 1 ? 'payload' : 'payloads'})`;
    case 'review':
      return `### 🟠 Dome: review required (${n.review} auto-run ${n.review === 1 ? 'change' : 'changes'})`;
    case 'incomplete':
      return '### ⚪ Dome: could not check every file';
    default:
      return '### ✅ Dome: no known pattern found';
  }
}

/** A pull request comment or job summary. Every line of wording is fixed; only file paths come from the repository. */
export function formatMarkdown(result: ScanResult): string {
  const lines = [headline(result), ''];
  const main = result.findings.filter((f) => f.severity !== 'info');
  const info = result.findings.filter((f) => f.severity === 'info');
  if (main.length > 0) lines.push(...table(main), '');
  if (result.verdict === 'block') {
    lines.push('**Do not check out this branch in VS Code, Cursor, or with `npm install`.** Review the files on GitHub only.', '');
  } else if (result.verdict === 'review') {
    lines.push('A maintainer should read each file above before merging. Review on GitHub rather than checking the branch out.', '');
  }
  if (result.incomplete.length > 0) {
    lines.push('**Could not check:**', '');
    for (const i of result.incomplete.slice(0, MAX_ROWS)) lines.push(`- <code>${cell(cleanPath(i.path))}</code> (${i.reason})`);
    lines.push('');
  }
  if (info.length > 0) {
    lines.push('<details><summary>Context (' + info.length + ')</summary>', '', ...table(info), '', '</details>', '');
  }
  lines.push(`<sub>Dome ${result.tool.version} · ${result.scope} scan · ${result.stats.filesInScope} files</sub>`, '');
  lines.push(HONESTY_NOTICE);
  return `${lines.join('\n')}\n`;
}
