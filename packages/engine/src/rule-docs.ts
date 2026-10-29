import { COMBINED_SUFFIX } from './grade.js';
import { ruleDocUrl } from './report/common.js';
import { ALL_RULES } from './rules/index.js';
import type { Category, RuleMeta, Severity } from './types.js';
import { VERSION } from './version.js';

const SEVERITY_LABEL: Record<Severity, string> = { block: '🔴 block', review: '🟠 review', info: '⚪ info' };

/** Markdown page for one rule, generated from its metadata so docs and SARIF help never drift. */
export function renderRuleDoc(meta: RuleMeta): string {
  const reasons = Object.values(meta.reasons)
    .map((r) => `- ${r}`)
    .join('\n');
  const refs = meta.doc.references.map((r) => `- [${r.title}](${r.url})`).join('\n');
  return `<!-- Generated from packages/engine/src/rules. Run \`pnpm docs:rules\` after changing a rule. -->

# ${meta.id}: ${meta.title}

| Category | Default level |
|---|---|
| \`${meta.category}\` | ${SEVERITY_LABEL[meta.severity]} |

${meta.summary}

## Why it matters

${meta.doc.why}

## What Dome reports

${reasons}

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

${meta.doc.falsePositives}

Accept a reviewed finding with a hash-pinned entry in \`.dome.yml\` (\`dome scan . --explain\` prints one). Editing the file invalidates the exception.${
    meta.category === 'intel' ? ' Known-indicator findings cannot be lowered or allowed.' : ''
  }

## References

${refs}
`;
}

export function renderRuleIndex(): string {
  const rows = ALL_RULES.map((r) => `| [${r.meta.id}](${r.meta.id}.md) | \`${r.meta.category}\` | ${SEVERITY_LABEL[r.meta.severity]} | ${r.meta.title} |`);
  return `<!-- Generated from packages/engine/src/rules. Run \`pnpm docs:rules\` after changing a rule. -->

# Rules

| ID | Category | Default level | Detects |
|---|---|---|---|
${rows.join('\n')}

Default levels are before grading. In a diff scan, a payload finding plus any auto-run surface in the same
change becomes a block ("${COMBINED_SUFFIX.trim()}"). In a full scan, a folder-open task plus a fake font
anywhere in the tree blocks. A folder-open task, automatic tasks turned on and a hidden \`.vscode\` together
block in either scan. See [How findings are graded](../../README.md#how-findings-are-graded).
`;
}

/** Every generated file under docs/rules, keyed by file name. */
export function ruleDocFiles(): Record<string, string> {
  const files: Record<string, string> = { 'README.md': renderRuleIndex() };
  for (const rule of ALL_RULES) files[`${rule.meta.id}.md`] = renderRuleDoc(rule.meta);
  return files;
}

export interface RuleCatalogEntry {
  id: string;
  /** Default level before grading; a finding's own severity wins. */
  level: Severity;
  category: Category;
  title: string;
  description: string;
  /** Fixed wording for each reason key a finding can carry. */
  reasons: Record<string, string>;
  docsUrl: string;
}

export interface RuleCatalog {
  schemaVersion: 1;
  engineVersion: string;
  rules: RuleCatalogEntry[];
}

/**
 * Machine-readable rule metadata (packages/engine/rules.json). dome-frontend
 * maps the rule IDs and reason keys in a report to this fixed text.
 */
export function ruleCatalog(): RuleCatalog {
  return {
    schemaVersion: 1,
    engineVersion: VERSION,
    rules: ALL_RULES.map(({ meta }) => ({
      id: meta.id,
      level: meta.severity,
      category: meta.category,
      title: meta.title,
      description: meta.summary,
      reasons: { ...meta.reasons },
      docsUrl: ruleDocUrl(meta.id),
    })),
  };
}

export function ruleCatalogJson(): string {
  return `${JSON.stringify(ruleCatalog(), null, 2)}\n`;
}
