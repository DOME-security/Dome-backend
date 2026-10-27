import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './npm-001.js';

const pkg = (scripts: Record<string, string>) => JSON.stringify({ name: 'x', scripts }, null, 2);

describe('DOME-NPM-001', () => {
  it('reports install scripts in a full scan', async () => {
    expect(await runRule(rule, { 'package.json': pkg({ postinstall: 'node scripts/setup.js', test: 'vitest' }) })).toEqual([
      'review:installScript@package.json:4',
    ]);
  });

  it('reports only added or changed install scripts in a diff scan', async () => {
    const base = { 'package.json': pkg({ prepare: 'husky', test: 'a' }) };
    expect(await runRule(rule, { 'package.json': pkg({ prepare: 'husky', test: 'b' }) }, { base })).toEqual([]);
    expect(await runRule(rule, { 'package.json': pkg({ prepare: 'husky && node x.js', test: 'a' }) }, { base })).toHaveLength(1);
  });

  it('reports a new binding.gyp', async () => {
    expect(await runRule(rule, { 'binding.gyp': '{}' })).toEqual(['review:nodeGyp@binding.gyp']);
  });
});
