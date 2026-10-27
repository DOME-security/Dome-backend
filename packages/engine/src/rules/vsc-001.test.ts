import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './vsc-001.js';

describe('DOME-VSC-001', () => {
  it('reports a folder-open task in tasks.json', async () => {
    const tasks = '{\n  "tasks": [{\n    "command": "echo DOME_FIXTURE",\n    "runOptions": { "runOn": "folderOpen" }\n  }]\n}';
    expect(await runRule(rule, { '.vscode/tasks.json': tasks })).toEqual(['review:folderOpen@.vscode/tasks.json:4']);
  });

  it('reports a folder-open task in a .code-workspace file', async () => {
    const ws = '{"tasks":{"tasks":[{"command":"echo DOME_FIXTURE","runOptions":{"runOn":"folderOpen"}}]}}';
    expect(await runRule(rule, { 'app.code-workspace': ws })).toHaveLength(1);
  });

  it('ignores tasks that only run on demand', async () => {
    expect(await runRule(rule, { '.vscode/tasks.json': '{"tasks":[{"command":"npm test"}]}' })).toEqual([]);
  });

  it('only looks at changed files in a diff scan', async () => {
    const tasks = '{"tasks":[{"command":"tsc -w","runOptions":{"runOn":"folderOpen"}}]}';
    expect(await runRule(rule, { '.vscode/tasks.json': tasks, 'a.txt': '2' }, { base: { '.vscode/tasks.json': tasks, 'a.txt': '1' } })).toEqual([]);
  });
});
