import { properties } from '../parsers/jsonc.js';
import { isSettingsFile, isWorkspaceFile, setting, settingsNode } from '../parsers/vscode.js';
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';

const EXCLUDE_SETTINGS = ['files.exclude', 'search.exclude', 'files.watcherExclude'];
const HIDDEN_PATH = /(?:^|[/*])\.vscode(?:$|[/*{])|tasks\.json/;

/**
 * True when an exclude pattern hides `.vscode` or `tasks.json`, including
 * brace forms such as `{.git,.vscode}`. The brace check splits on `}` instead
 * of using `\{[^}]*vscode`, which backtracks quadratically on a key made of
 * many `{` characters.
 */
export function hidesVscode(pattern: string): boolean {
  if (HIDDEN_PATH.test(pattern)) return true;
  for (const group of pattern.split('}')) {
    const open = group.indexOf('{');
    if (open !== -1 && /\bvscode\b/.test(group.slice(open))) return true;
  }
  return false;
}

export default defineRule(
  {
    id: 'DOME-VSC-003',
    title: '.vscode hidden from view',
    category: 'autorun',
    severity: 'review',
    summary: '`files.exclude` or `search.exclude` hides `.vscode` or `tasks.json`.',
    reasons: {
      hidden: 'Workspace settings hide the .vscode folder or tasks.json from the file explorer or search.',
    },
    doc: {
      why: 'Hiding `.vscode` keeps a malicious task out of sight in the editor. The RMG-Py attacker added `files.exclude` entries for exactly this.',
      falsePositives: 'Some projects tidy the explorer by hiding editor folders. Hiding `.vscode` specifically is unusual.',
      references: [REFS.rmgPy],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, (p) => isSettingsFile(p) || isWorkspaceFile(p))) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      const settings = settingsNode(path, text);
      for (const key of EXCLUDE_SETTINGS) {
        for (const [pattern, value, keyNode] of properties(setting(settings, key))) {
          const enabled = value.type === 'boolean' ? value.value === true : value.type === 'object';
          if (enabled && hidesVscode(pattern)) ctx.report('hidden', ctx.locate(path, keyNode.offset));
        }
      }
    }
  },
);
