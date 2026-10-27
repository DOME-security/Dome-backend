import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './prp-001.js';

describe('DOME-PRP-001', () => {
  it('blocks a script that rewinds the clock, amends and force-pushes', async () => {
    const bat = '@echo off\r\nREM DOME_FIXTURE\r\ndate 01-01-2024\r\ngit add .\r\ngit commit --amend --no-edit\r\ngit push -f origin HEAD\r\n';
    expect(await runRule(rule, { 'temp_auto_push.bat': bat })).toEqual(['block:rewritesHistory@temp_auto_push.bat:5']);
  });

  it('reviews amend plus force-push without clock changes', async () => {
    expect(await runRule(rule, { 'release.sh': 'git commit --amend\ngit push --force\n' })).toEqual(['review:amendForcePush@release.sh:1']);
  });

  it('ignores ordinary push scripts', async () => {
    expect(await runRule(rule, { 'deploy.sh': 'git commit -m x\ngit push\n' })).toEqual([]);
  });
});
