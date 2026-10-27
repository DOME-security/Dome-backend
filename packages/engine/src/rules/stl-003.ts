import { strkeyIsValidSeed } from '../strkey.js';
import { defineRule, targetsWhere } from './rule.js';
import { isAssetPath, extname } from '../parsers/text.js';
import { isVendored, looksBinary, REFS } from './shared.js';

const CANDIDATE = /\bS[A-Z2-7]{55}\b/g;
const MAX_TEXT_BYTES = 1024 * 1024;
const BINARY_EXTENSIONS = new Set(['wasm', 'node', 'so', 'dll', 'dylib', 'exe', 'jar', 'gz', 'tgz', 'xz', 'bz2', '7z', 'rar']);

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
    const candidates = (p: string) => !isVendored(p) && !isAssetPath(p) && !BINARY_EXTENSIONS.has(extname(p));
    for (const { path, size } of targetsWhere(ctx, candidates)) {
      if (size < 56 || size > MAX_TEXT_BYTES) continue;
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
