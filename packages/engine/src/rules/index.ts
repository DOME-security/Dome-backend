import agt001 from './agt-001.js';
import dev001 from './dev-001.js';
import gha001 from './gha-001.js';
import git001 from './git-001.js';
import git002 from './git-002.js';
import npm001 from './npm-001.js';
import npm002 from './npm-002.js';
import type { Rule } from './rule.js';
import vsc001 from './vsc-001.js';
import vsc002 from './vsc-002.js';
import vsc003 from './vsc-003.js';
import vsc004 from './vsc-004.js';
import vsc005 from './vsc-005.js';
import vsc006 from './vsc-006.js';
import type { Category, RuleMeta } from '../types.js';

/** Every rule, in documentation order. */
export const ALL_RULES: readonly Rule[] = [
  vsc001,
  vsc002,
  vsc003,
  vsc004,
  vsc005,
  vsc006,
  npm001,
  npm002,
  dev001,
  agt001,
  gha001,
  git001,
  git002,
] as Rule[];

export function rulesIn(categories: readonly Category[]): Rule[] {
  return ALL_RULES.filter((r) => categories.includes(r.meta.category));
}

export function ruleMeta(id: string): RuleMeta | undefined {
  return ALL_RULES.find((r) => r.meta.id === id)?.meta;
}
