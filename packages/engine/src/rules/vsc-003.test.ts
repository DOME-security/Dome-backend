import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './vsc-003.js';

describe('DOME-VSC-003', () => {
  it.each(['**/.vscode', '.vscode', '.vscode/tasks.json', '**/tasks.json'])('reports %s hidden by files.exclude', async (pattern) => {
    const settings = JSON.stringify({ 'files.exclude': { [pattern]: true } });
    expect(await runRule(rule, { '.vscode/settings.json': settings })).toHaveLength(1);
  });

  it('reports search.exclude too', async () => {
    expect(await runRule(rule, { '.vscode/settings.json': '{"search.exclude":{"**/.vscode":true}}' })).toHaveLength(1);
  });

  it('ignores ordinary excludes and disabled entries', async () => {
    const settings = '{"files.exclude":{"**/node_modules":true,"**/.vscode":false,"**/.vscodeignore":true}}';
    expect(await runRule(rule, { '.vscode/settings.json': settings })).toEqual([]);
  });
});
