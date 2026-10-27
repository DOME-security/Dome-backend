import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './git-001.js';

describe('DOME-GIT-001', () => {
  it('notes a negation that re-includes .vscode', async () => {
    expect(await runRule(rule, { '.gitignore': 'node_modules\n!.vscode/\n' })).toEqual(['info:unignored@.gitignore:2']);
  });

  it('notes a removed .env ignore in a diff scan', async () => {
    expect(await runRule(rule, { '.gitignore': 'node_modules\n' }, { base: { '.gitignore': 'node_modules\n.env\n' } })).toEqual([
      'info:removed@.gitignore',
    ]);
  });

  it('ignores unrelated changes', async () => {
    expect(await runRule(rule, { '.gitignore': '.env\ndist\n' }, { base: { '.gitignore': '.env\n' } })).toEqual([]);
  });
});
