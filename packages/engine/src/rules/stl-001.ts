import { significant, tokenize, usesNetwork, type Token } from '../parsers/js.js';
import { extname, isJsLike } from '../parsers/text.js';
import { defineRule, targetsWhere } from './rule.js';
import { isShellScript, isTestPath, isVendored, REFS } from './shared.js';

const CODE_EXTENSIONS = new Set(['py', 'rb', 'go', 'rs']);
const IDENTITY_DIRS = new Set(['stellar', 'soroban']);
// Built from parts so this rule's own source does not match itself.
const IDENTITY_PATHS = [...IDENTITY_DIRS].map((dir) => dir + '/identity');

/**
 * Offset of a JS string literal that is a path into an identity folder, or
 * of path segments such as `join(home, '.config', 'stellar', 'identity')`.
 * Prose (strings with spaces) does not count.
 */
export function identityReference(text: string, tokens: Token[]): number | undefined {
  const sig = significant(tokens);
  for (let k = 0; k < sig.length; k++) {
    const t = sig[k]!;
    if (t.type !== 'string' && t.type !== 'template') continue;
    const body = t.type === 'string' ? t.value : text.slice(t.start, t.end);
    if (!/\s/.test(body) && IDENTITY_PATHS.some((p) => body.replace(/\\/g, '/').includes(p))) {
      return t.start;
    }
    const next = sig[k + 2];
    if (t.type === 'string' && IDENTITY_DIRS.has(t.value) && sig[k + 1]?.value === ',' && next?.type === 'string' && next.value === 'identity') {
      return t.start;
    }
  }
  return undefined;
}

export default defineRule(
  {
    id: 'DOME-STL-001',
    title: 'Code reads Stellar CLI identities',
    category: 'stellar',
    severity: 'review',
    summary:
      'Code that reads Stellar CLI identities (`~/.config/stellar/identity/*.toml`, plaintext unless created with `--secure-store`).',
    reasons: {
      reads: 'Project code refers to the Stellar CLI identity folder, where secret keys are stored.',
      exfiltrates: 'Project code refers to the Stellar CLI identity folder and also makes network requests.',
    },
    doc: {
      why: 'Stellar CLI identities are stored as plaintext TOML files containing secret keys unless created with `--secure-store`. A project file has no reason to read them, and code that reads them and talks to the network can drain accounts.',
      falsePositives: 'Stellar developer tooling that manages identities on purpose.',
      references: [REFS.stellarCliKeys],
    },
  },
  async (ctx) => {
    const candidates = (p: string) =>
      (isJsLike(p) || isShellScript(p) || CODE_EXTENSIONS.has(extname(p))) && !isTestPath(p) && !isVendored(p);
    for (const { path } of targetsWhere(ctx, candidates)) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      const tokens = isJsLike(path) ? tokenize(text) : undefined;
      const hit = tokens
        ? identityReference(text, tokens)
        : IDENTITY_PATHS.map((p) => text.replace(/\\/g, '/').indexOf(p)).find((i) => i !== -1);
      if (hit === undefined) continue;
      const network = tokens !== undefined && usesNetwork(tokens);
      ctx.report(network ? 'exfiltrates' : 'reads', ctx.locate(path, hit), network ? 'block' : 'review');
    }
  },
);
