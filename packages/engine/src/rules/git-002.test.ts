import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './git-002.js';

describe('DOME-GIT-002', () => {
  it('reports committed husky and .githooks hooks but not husky internals', async () => {
    const result = await runRule(rule, {
      '.husky/pre-commit': 'echo DOME_FIXTURE',
      '.husky/_/husky.sh': '',
      '.githooks/post-checkout': 'echo DOME_FIXTURE',
      '.husky/README.md': '',
    });
    expect(result).toEqual(['review:committedHook@.githooks/post-checkout', 'review:committedHook@.husky/pre-commit']);
  });

  it('reports core.hooksPath and simple-git-hooks', async () => {
    const pkg = JSON.stringify({ scripts: { prepare: 'git config core.hooksPath .hooks' }, 'simple-git-hooks': { 'pre-commit': 'x' } });
    expect(await runRule(rule, { 'package.json': pkg })).toHaveLength(2);
  });
});

describe('DOME-GIT-002 scope', () => {
  it('ignores hooks nested in subfolders, which hook managers never install', async () => {
    expect(await runRule(rule, { 'tests/integration/x/.husky/pre-commit': 'echo DOME_FIXTURE' })).toEqual([]);
  });
});
