import { tokenize, usesNetwork } from '../parsers/js.js';
import { extname, isJsLike } from '../parsers/text.js';
import { defineRule, targetsWhere } from './rule.js';
import { isShellScript, isTestPath, REFS } from './shared.js';

// Built from parts so this rule's own source does not match itself.
const IDENTITY_PATHS = [['stellar', 'identity'], ['soroban', 'identity']].map((p) => p.join('/'));
const CODE_EXTENSIONS = new Set(['py', 'rb', 'go', 'rs']);

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
      (isJsLike(p) || isShellScript(p) || CODE_EXTENSIONS.has(extname(p))) && !isTestPath(p) && !p.includes('node_modules/');
    for (const { path } of targetsWhere(ctx, candidates)) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      const normalized = text.replace(/\\\\?/g, '/');
      const hit = IDENTITY_PATHS.map((p) => normalized.indexOf(p)).find((i) => i !== -1);
      if (hit === undefined) continue;
      const network = isJsLike(path) && usesNetwork(tokenize(text));
      ctx.report(network ? 'exfiltrates' : 'reads', ctx.locate(path, hit), network ? 'block' : 'review');
    }
  },
);
