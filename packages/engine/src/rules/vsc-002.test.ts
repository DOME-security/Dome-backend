import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './vsc-002.js';

describe('DOME-VSC-002', () => {
  it('reports automatic tasks turned on', async () => {
    expect(await runRule(rule, { '.vscode/settings.json': '{\n  "task.allowAutomaticTasks": "on"\n}' })).toEqual([
      'review:allowAutomaticTasks@.vscode/settings.json:2',
    ]);
  });

  it('reads workspace settings', async () => {
    expect(await runRule(rule, { 'a.code-workspace': '{"settings":{"task.allowAutomaticTasks":"on"}}' })).toHaveLength(1);
  });

  it('ignores off and prompt', async () => {
    expect(await runRule(rule, { '.vscode/settings.json': '{"task.allowAutomaticTasks":"off"}' })).toEqual([]);
  });
});
