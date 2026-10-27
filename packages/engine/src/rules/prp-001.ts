import { defineRule, targetsWhere } from './rule.js';
import { isShellScript, REFS } from './shared.js';

const CLOCK = /git_committer_date|git_author_date|set-date|faketime|libfaketime|\bdate\s+-s\b|\bdate\s+\d|\btime\s+\d|--date[= ]/;
const FORCE = /\s(?:--force(?:-with-lease)?|-f)(?:\s|$)|\s\+\S/;

export default defineRule(
  {
    id: 'DOME-PRP-001',
    title: 'Propagation script rewrites history',
    category: 'payload',
    severity: 'review',
    summary: 'Propagation scripts that rewind the clock, amend the last commit and force-push.',
    reasons: {
      amendForcePush: 'A script amends the last commit and force-pushes it.',
      rewritesHistory: 'A script rewinds the clock, amends the last commit and force-pushes, hiding a change inside existing history.',
    },
    doc: {
      why: 'PolinRider spread with `temp_auto_push.bat`: it set the system clock back, amended the latest commit to include the payload and force-pushed, so the change appears in an old, already-reviewed commit.',
      falsePositives: 'Release helpers that amend and force-push to a personal branch. Rewinding the clock has no honest use here.',
      references: [REFS.polinRider, REFS.rmgPy],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, isShellScript)) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      let amend = -1;
      let force = -1;
      let clock = false;
      text.toLowerCase().split('\n').forEach((line, i) => {
        if (line.includes('commit') && line.includes('--amend') && amend === -1) amend = i;
        if (line.includes('push') && FORCE.test(line) && force === -1) force = i;
        if (CLOCK.test(line)) clock = true;
      });
      if (amend === -1 || force === -1) continue;
      ctx.report(clock ? 'rewritesHistory' : 'amendForcePush', { path, line: amend + 1 }, clock ? 'block' : 'review');
    }
  },
);
