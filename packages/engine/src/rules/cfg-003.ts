import { findCodeConstruction, tokenize } from '../parsers/js.js';
import { defineRule, targetsWhere } from './rule.js';
import { isServerSideCode, isTestPath, isVendored, REFS } from './shared.js';

export default defineRule(
  {
    id: 'DOME-CFG-003',
    title: 'Runtime code construction in config or route code',
    category: 'payload',
    severity: 'review',
    summary:
      'Runtime code construction (`eval`, `new Function`, `vm.runIn*`, detached hidden `child_process` spawns) in config or route files.',
    reasons: {
      eval: 'A config or route file calls eval.',
      function: 'A config or route file builds a function from a string with Function.',
      vm: 'A config or route file compiles and runs code with the vm module.',
      hiddenSpawn: 'A config or route file starts a detached, hidden background process.',
    },
    doc: {
      why: 'Config files and server routes run with full privileges whenever the project builds or starts. Loaders decode a payload and run it with `eval` or `new Function`, or start a detached hidden process that outlives the dev server.',
      falsePositives: 'Some build tooling evaluates code on purpose. Review the call and accept it with a hash-pinned `allow` entry.',
      references: [REFS.microsoftNext, REFS.polinRider],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, (p) => isServerSideCode(p) && !isTestPath(p) && !isVendored(p))) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      if (!/eval|Function|runIn|compileFunction|Script|detached/.test(text)) continue;
      for (const hit of findCodeConstruction(tokenize(text))) ctx.report(hit.kind, ctx.locate(path, hit.offset));
    }
  },
);
