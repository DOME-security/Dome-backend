import { tokenize, usesNetwork } from '../parsers/js.js';
import { extname, isJsLike } from '../parsers/text.js';
import { defineRule, targetsWhere } from './rule.js';
import { isShellScript, isTestPath, isVendored, REFS } from './shared.js';

// Built from parts so this rule's own source does not match itself.
const WALLET_STORAGE = [
  ['Local Extension', 'Settings'].join(' '),
  ['chrome-extension', ''].join('_'),
  ['moz-extension', '/'].join(':/'),
  ['IndexedDB', 'chrome-extension'].join('/'),
];
const CODE_EXTENSIONS = new Set(['py', 'rb', 'go', 'rs']);

export default defineRule(
  {
    id: 'DOME-STL-002',
    title: 'Code reads browser wallet extension storage',
    category: 'stellar',
    severity: 'review',
    summary: 'Code that reads browser wallet extension storage (Freighter and others) from a project file.',
    reasons: {
      reads: 'Project code refers to browser extension storage, where wallet extensions keep their vaults.',
      exfiltrates: 'Project code refers to browser extension storage and also makes network requests.',
    },
    doc: {
      why: 'Developer-targeting malware collects browser extension storage to steal wallet vaults, including Stellar wallets such as Freighter. Application code never needs to read another extension\'s storage from disk.',
      falsePositives: 'Browser automation and extension development tooling.',
      references: [REFS.microsoftNext, REFS.abstractTasks],
    },
  },
  async (ctx) => {
    const candidates = (p: string) =>
      (isJsLike(p) || isShellScript(p) || CODE_EXTENSIONS.has(extname(p))) && !isTestPath(p) && !isVendored(p);
    for (const { path } of targetsWhere(ctx, candidates)) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      const hit = WALLET_STORAGE.map((p) => text.indexOf(p)).find((i) => i !== -1);
      if (hit === undefined) continue;
      const network = isJsLike(path) && usesNetwork(tokenize(text));
      ctx.report(network ? 'exfiltrates' : 'reads', ctx.locate(path, hit), network ? 'block' : 'review');
    }
  },
);
