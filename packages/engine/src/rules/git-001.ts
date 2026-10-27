import { basename } from '../parsers/text.js';
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';

const IGNORES = /^\/?(?:\*\*\/)?(?:\.vscode|\.env)(?:\/|\*|\.\*)?$/;
const UNIGNORES = /^!\/?(?:\*\*\/)?(?:\.vscode|\.env)(?:\/.*)?$/;

function lines(text: string): string[] {
  return text.split(/\r?\n/).map((l) => l.trim());
}

export default defineRule(
  {
    id: 'DOME-GIT-001',
    title: '.gitignore stops ignoring .vscode or .env',
    category: 'autorun',
    severity: 'info',
    summary: '`.gitignore` change that stops ignoring `.vscode` or `.env`.',
    reasons: {
      unignored: '.gitignore explicitly re-includes .vscode or .env files.',
      removed: '.gitignore no longer ignores .vscode or .env.',
    },
    doc: {
      why: 'In the RMG-Py incident and RitualPlay analysis, the attacker edited `.gitignore` so the malicious `.vscode` folder would be committed and pushed to other contributors.',
      falsePositives: 'Teams that intentionally share `.vscode/settings.json` often un-ignore it. This rule is context only.',
      references: [REFS.rmgPy],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, (p) => basename(p) === '.gitignore')) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      const head = lines(text);
      const negation = head.findIndex((l) => UNIGNORES.test(l));
      if (negation !== -1) {
        ctx.report('unignored', { path, line: negation + 1 });
        continue;
      }
      const base = await ctx.readBaseText(path);
      if (base === undefined) continue;
      const removed = lines(base).filter((l) => IGNORES.test(l) && !head.includes(l));
      if (removed.length > 0) ctx.report('removed', { path });
    }
  },
);
