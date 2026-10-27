import { findCodeConstruction, findModuleTail, tokenize } from '../parsers/js.js';
import { isJsConfigFile } from '../parsers/text.js';
import { defineRule, targetsWhere } from './rule.js';
import { isVendored, REFS } from './shared.js';

/** Blank runs this long between the export and more code are padding, not formatting. */
export const PADDING_THRESHOLD = 80;

export default defineRule(
  {
    id: 'DOME-CFG-001',
    title: 'Code after the module body in a config file',
    category: 'payload',
    severity: 'review',
    summary: 'Code after the module body in JS/TS config files, especially after a long run of whitespace.',
    reasons: {
      tail: 'A config file has code after its export statement.',
      paddedTail: 'A config file has code after its export statement, pushed out of view by a long run of whitespace.',
    },
    doc: {
      why: 'PolinRider and the Next.js campaign appended an obfuscated loader to `postcss.config.mjs`, `tailwind.config.js` and `next.config.*`, after `export default` and hundreds of spaces so it sits off-screen in editors and diffs. The build tool then runs it on every `npm run dev`.',
      falsePositives:
        'Declarations after the export (helper functions, constants, more `module.exports` assignments) are ignored unless they are padded or build code at runtime. Other statements after the export are reported for review.',
      references: [REFS.polinRider, REFS.microsoftNext],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, (p) => isJsConfigFile(p) && !isVendored(p))) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      const tokens = tokenize(text);
      const tail = findModuleTail(text, tokens);
      if (!tail) continue;
      const constructs = findCodeConstruction(tokens).some((c) => c.offset >= tail.offset);
      if (tail.padding >= PADDING_THRESHOLD || constructs) ctx.report('paddedTail', ctx.locate(path, tail.offset), 'block');
      else if (!tail.declaration) ctx.report('tail', ctx.locate(path, tail.offset));
    }
  },
);
