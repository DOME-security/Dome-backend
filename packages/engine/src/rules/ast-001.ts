import { checkFont } from '../parsers/font.js';
import { extname, FONT_EXTENSIONS } from '../parsers/text.js';
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';

export default defineRule(
  {
    id: 'DOME-AST-001',
    title: 'Font file is not a font',
    category: 'payload',
    severity: 'review',
    summary: 'A file with a font extension whose bytes are not a real font (checked by format header fields, not just magic bytes).',
    reasons: {
      notAFont: 'A file named like a font does not have a valid font header.',
    },
    doc: {
      why: 'PolinRider, GhostAction and the RMG-Py attacker stored their obfuscated JavaScript loader as `public/fonts/fa-solid-*.woff2`. Nobody reviews binary-looking assets in a diff, and the file is later run with `node`. Combined with any auto-run surface in the same change, this becomes a block.',
      falsePositives: 'Corrupt or truncated font files. Git LFS pointer files are recognized and skipped.',
      references: [REFS.polinRider, REFS.rmgPy],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, (p) => FONT_EXTENSIONS.has(extname(p)) && !p.includes('node_modules/'))) {
      const bytes = await ctx.readBytes(path);
      if (bytes === undefined) continue;
      const check = checkFont(bytes);
      if (!check.valid && check.problem !== 'lfs-pointer' && check.problem !== 'empty') ctx.report('notAFont', { path });
    }
  },
);
