import { isPackageJson, parsePackageJson } from '../parsers/manifests.js';
import { basename } from '../parsers/text.js';
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';

const LOCKFILES = new Set(['package-lock.json', 'npm-shrinkwrap.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lock']);
const BEFORE = new Set(['"', "'", ' ', '\n', '\t', '/']);
const AFTER = new Set(['@', '"', "'", ':']);

/** Offset of `name` used as a whole package name in a lockfile, or -1. */
export function findPackageInLockfile(text: string, name: string): number {
  let from = 0;
  for (;;) {
    const at = text.indexOf(name, from);
    if (at === -1) return -1;
    const before = text[at - 1];
    const after = text[at + name.length];
    const scopedSuffix = before === '/' && !text.slice(Math.max(0, at - 13), at).endsWith('node_modules/');
    if ((before === undefined || BEFORE.has(before)) && !scopedSuffix && after !== undefined && AFTER.has(after)) return at;
    from = at + 1;
  }
}

export default defineRule(
  {
    id: 'DOME-IOC-003',
    title: 'Known malicious npm package',
    category: 'intel',
    severity: 'block',
    summary: 'Dependencies on known malicious npm packages.',
    reasons: {
      dependency: 'package.json depends on a package published as part of a known malware campaign.',
      lockfile: 'The lockfile resolves a package published as part of a known malware campaign.',
    },
    doc: {
      why: 'PolinRider published look-alike packages such as `tailwindcss-style-animate` whose install scripts ran the loader. A dependency on one runs it on the next `npm install`, even if it was added deep in the lockfile.',
      falsePositives: 'None: package names on the list are confirmed malicious.',
      references: [REFS.polinRider],
    },
  },
  async (ctx) => {
    if (ctx.intel.packages.size === 0) return;
    for (const { path } of targetsWhere(ctx, (p) => isPackageJson(p) || LOCKFILES.has(basename(p)))) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      if (isPackageJson(path)) {
        for (const dep of parsePackageJson(text).dependencies) {
          if (ctx.intel.packages.has(dep.name)) ctx.report('dependency', ctx.locate(path, dep.offset));
        }
      } else {
        for (const name of ctx.intel.packages) {
          const at = findPackageInLockfile(text, name);
          if (at !== -1) ctx.report('lockfile', ctx.locate(path, at));
        }
      }
    }
  },
);
