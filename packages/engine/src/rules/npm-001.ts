import { INSTALL_SCRIPTS, isPackageJson, parsePackageJson } from '../parsers/manifests.js';
import { basename } from '../parsers/text.js';
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';

export default defineRule(
  {
    id: 'DOME-NPM-001',
    title: 'Install script added or changed',
    category: 'autorun',
    severity: 'review',
    summary: '`preinstall`, `install`, `postinstall` or `prepare` scripts added or changed (and `binding.gyp`, which npm builds on install).',
    reasons: {
      installScript: 'A package.json script that npm runs automatically on install was added or changed.',
      nodeGyp: 'A binding.gyp file makes npm run a native build on install.',
    },
    doc: {
      why: 'Install scripts run with the developer\'s privileges the moment someone types `npm install`. PolinRider shipped through packages such as `tailwindcss-style-animate` whose install hooks ran the loader.',
      falsePositives:
        'Many honest packages use `prepare` to build or `postinstall` to set up git hooks. Read the command and check that it only runs tracked source or a known build output.',
      references: [REFS.npmScripts, REFS.polinRider],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, isPackageJson)) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      const before = new Map(
        parsePackageJson((await ctx.readBaseText(path)) ?? '{}').scripts.map((s) => [s.name, s.text] as const),
      );
      for (const script of parsePackageJson(text).scripts) {
        if (!INSTALL_SCRIPTS.has(script.name)) continue;
        if (ctx.scope === 'diff' && before.get(script.name) === script.text) continue;
        ctx.report('installScript', ctx.locate(path, script.offset));
      }
    }
    for (const { path } of targetsWhere(ctx, (p) => basename(p) === 'binding.gyp' && !p.includes('node_modules/'))) {
      if (ctx.scope === 'diff' && (await ctx.readBaseText(path)) !== undefined) continue;
      ctx.report('nodeGyp', { path });
    }
  },
);
