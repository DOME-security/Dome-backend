import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './vsc-006.js';

describe('DOME-VSC-006', () => {
  it('notes hidden output on a folder-open task', async () => {
    const tasks = JSON.stringify({
      tasks: [{ command: 'echo DOME_FIXTURE', runOptions: { runOn: 'folderOpen' }, presentation: { reveal: 'never', echo: false } }],
    });
    expect(await runRule(rule, { '.vscode/tasks.json': tasks })).toEqual(['info:hiddenOutput@.vscode/tasks.json:1']);
  });

  it('ignores hidden output on an ordinary task', async () => {
    const tasks = JSON.stringify({ tasks: [{ command: 'tsc -w', presentation: { reveal: 'never' } }] });
    expect(await runRule(rule, { '.vscode/tasks.json': tasks })).toEqual([]);
  });
});
