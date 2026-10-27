import { longestPaddedLine } from '../parsers/js.js';
import { isJsConfigFile, isJsLike } from '../parsers/text.js';
import { defineRule, targetsWhere } from './rule.js';
import { isTestPath, isVendored, REFS } from './shared.js';

const PADDING = 150;
const LONG_LINE = 4000;

export default defineRule(
  {
    id: 'DOME-CFG-002',
    title: 'Whitespace padding or very long line in source',
    category: 'payload',
    severity: 'review',
    summary: 'Very long lines or heavy whitespace padding in source and config files.',
    reasons: {
      padding: 'A source line has code pushed far to the right by a long run of whitespace.',
      longLine: 'A source file that is otherwise readable has a single extremely long line.',
    },
    doc: {
      why: 'Payloads appended to ordinary source files hide past the right edge of the editor or review pane. Minified bundles are expected to have long lines and are skipped by name.',
      falsePositives: 'Generated files committed without a `.min.js` name, and data embedded as a long string literal. Test files, dependency folders and build output are skipped.',
      references: [REFS.polinRider],
    },
  },
  async (ctx) => {
    const candidates = (p: string) => isJsLike(p) && !isJsConfigFile(p) && !isVendored(p) && !isTestPath(p);
    for (const { path } of targetsWhere(ctx, candidates)) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      const padded = longestPaddedLine(text);
      if (padded && padded.padding >= PADDING) {
        ctx.report('padding', ctx.locate(path, padded.offset));
        continue;
      }
      const lines = text.split('\n');
      if (lines.length < 10) continue;
      const long = lines.map((l, i) => [l.length, i] as const).filter(([len]) => len > LONG_LINE);
      if (long.length > 0 && long.length <= 2) ctx.report('longLine', { path, line: long[0]![1] + 1 });
    }
  },
);
