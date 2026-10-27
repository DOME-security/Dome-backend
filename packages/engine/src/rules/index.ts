import type { Rule } from './rule.js';
import type { Category, RuleMeta } from '../types.js';

/** Every rule, in documentation order. */
export const ALL_RULES: readonly Rule[] = [
] as Rule[];

export function rulesIn(categories: readonly Category[]): Rule[] {
  return ALL_RULES.filter((r) => categories.includes(r.meta.category));
}

export function ruleMeta(id: string): RuleMeta | undefined {
  return ALL_RULES.find((r) => r.meta.id === id)?.meta;
}
