import { child, properties } from '../parsers/jsonc.js';
import { isPackageJson, parsePackageJson } from '../parsers/manifests.js';
import { basename } from '../parsers/text.js';
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';

const HOOK_FILE = /^(?:.*\/)?(?:\.husky\/(?!_\/)[^/]+|\.githooks\/[^/]+)$/;
const HOOK_NAMES = new Set([
  'pre-commit',
  'prepare-commit-msg',
  'commit-msg',
  'post-commit',
  'pre-rebase',
  'post-checkout',
  'post-merge',
  'pre-push',
  'post-rewrite',
  'pre-auto-gc',
]);

export default defineRule(
  {
    id: 'DOME-GIT-002',
    title: 'Git hooks committed to the repository',
    category: 'autorun',
    severity: 'review',
    summary: 'Git hooks committed to the repo (`.husky/`, `.githooks/`, `simple-git-hooks`) or a `core.hooksPath` setting.',
    reasons: {
      committedHook: 'A git hook is committed to the repository and runs on commits, checkouts or pushes once installed.',
      hooksPath: 'A script or config points git at hooks inside the repository with core.hooksPath.',
    },
    doc: {
      why: 'Hooks committed to the repository are installed by `npm install` (husky, simple-git-hooks) or by `core.hooksPath`, then run on every commit, checkout or push. A changed hook is an easy place to hide a payload.',
      falsePositives: 'Husky and lint-staged setups are common and honest. Review hook changes like any other auto-run file.',
      references: [REFS.rmgPy],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, (p) => HOOK_FILE.test(p) && HOOK_NAMES.has(basename(p)))) {
      ctx.report('committedHook', { path });
    }
    for (const { path } of targetsWhere(ctx, (p) => isPackageJson(p) || basename(p) === '.gitconfig' || p.endsWith('.gitconfig'))) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      if (isPackageJson(path)) {
        const pkg = parsePackageJson(text);
        const hooksPath = pkg.scripts.find((s) => /core\.hookspath/i.test(s.text));
        if (hooksPath) ctx.report('hooksPath', ctx.locate(path, hooksPath.offset));
        const simple = properties(pkg.root).find(([k]) => k === 'simple-git-hooks');
        if (simple && child(pkg.root, 'simple-git-hooks')?.type === 'object') {
          ctx.report('committedHook', ctx.locate(path, simple[2].offset));
        }
      } else {
        const index = text.search(/hookspath/i);
        if (index !== -1) ctx.report('hooksPath', ctx.locate(path, index));
      }
    }
  },
);
