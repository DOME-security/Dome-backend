import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import { sha256Hex } from '../hash.js';
import ioc001 from './ioc-001.js';
import ioc002 from './ioc-002.js';
import ioc003, { findPackageInLockfile } from './ioc-003.js';
import ioc004 from './ioc-004.js';

// Test-only indicators. Real indicator data lives in packages/intel.
const content = 'DOME_FIXTURE known-bad sample';
const intel = {
  hashes: new Set([sha256Hex(new TextEncoder().encode(content))]),
  markers: ['DOME_FIXTURE_MARKER'],
  packages: new Set(['dome-fixture-evil']),
  domains: ['dome-fixture.invalid'],
};

describe('DOME-IOC-001', () => {
  it('blocks files on the hash list', async () => {
    expect(await runRule(ioc001, { 'a.js': content, 'b.js': 'other' }, { intel })).toEqual(['block:knownHash@a.js']);
  });
});

describe('DOME-IOC-002', () => {
  it('blocks files containing a campaign marker', async () => {
    expect(await runRule(ioc002, { 'x.woff2': 'abc\nDOME_FIXTURE_MARKER' }, { intel })).toEqual(['block:marker@x.woff2:2']);
  });
});

describe('DOME-IOC-003', () => {
  it('blocks known packages in package.json and lockfiles', async () => {
    const files = {
      'package.json': JSON.stringify({ dependencies: { 'dome-fixture-evil': '1.0.0' } }),
      'package-lock.json': '{"packages":{"node_modules/dome-fixture-evil":{}}}',
      'pnpm-lock.yaml': 'packages:\n  dome-fixture-evil@1.0.0:\n',
    };
    expect((await runRule(ioc003, files, { intel })).map((r) => r.split('@')[0])).toEqual(['block:lockfile', 'block:dependency', 'block:lockfile']);
  });

  it('matches whole package names only', () => {
    expect(findPackageInLockfile('"@scope/dome-fixture-evil@1"', 'dome-fixture-evil')).toBe(-1);
    expect(findPackageInLockfile('"dome-fixture-evil-not@1"', 'dome-fixture-evil')).toBe(-1);
    expect(findPackageInLockfile('"node_modules/dome-fixture-evil"', 'dome-fixture-evil')).toBeGreaterThan(0);
  });
});

describe('DOME-IOC-004', () => {
  it('blocks known domains in tasks, scripts and config code', async () => {
    const files = {
      '.vscode/tasks.json': JSON.stringify({ tasks: [{ command: 'curl https://cdn.dome-fixture.invalid/x' }] }),
      'next.config.js': "fetch('https://dome-fixture.invalid')",
      'README.md': 'dome-fixture.invalid',
      'package.json': JSON.stringify({ scripts: { x: 'curl notdome-fixture.invalid' } }),
    };
    expect((await runRule(ioc004, files, { intel })).map((r) => r.split('@')[1])).toEqual(['.vscode/tasks.json:1', 'next.config.js:1']);
  });
});

describe('indicator rules without data', () => {
  it('do nothing when intel is empty', async () => {
    expect(await runRule(ioc001, { 'a.js': content })).toEqual([]);
  });
});
