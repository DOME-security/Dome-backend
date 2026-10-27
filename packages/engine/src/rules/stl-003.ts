import { strkeyIsValidSeed } from '../strkey.js';
import { defineRule, targetsWhere } from './rule.js';
import { looksBinary, REFS } from './shared.js';

const CANDIDATE = /\bS[A-Z2-7]{55}\b/g;

export default defineRule(
  {
    id: 'DOME-STL-003',
    title: 'Hard-coded Stellar secret key',
    category: 'stellar',
    severity: 'review',
    summary: 'Hard-coded Stellar secret keys (`S…` strkeys with a valid checksum) committed to the repo.',
    reasons: {
      secretKey: 'A Stellar secret key is committed to the repository.',
    },
    doc: {
      why: 'Anyone who can read the repository can sign for the account. Only candidates with a valid SEP-23 checksum are reported, so random 56-character strings do not match.',
      falsePositives: 'Throwaway testnet keys in examples. Generate them at runtime instead of committing them.',
      references: [REFS.strkey],
    },
  },
  async (ctx) => {
    for (const { path, size } of targetsWhere(ctx, (p) => !p.includes('node_modules/'))) {
      if (size < 56) continue;
      const bytes = await ctx.readBytes(path);
      if (!bytes || looksBinary(bytes)) continue;
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      for (const match of text.matchAll(CANDIDATE)) {
        if (strkeyIsValidSeed(match[0])) {
          ctx.report('secretKey', ctx.locate(path, match.index));
          break;
        }
      }
    }
  },
);
