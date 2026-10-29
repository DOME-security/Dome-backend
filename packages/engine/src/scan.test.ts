import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { scanFiles } from './__fixtures__/run-rule.js';
import { ALL_RULES } from './rules/index.js';
import type { Rule } from './rules/rule.js';
import { exitCodeFor, scan } from './scan.js';
import { MemorySource } from './source/memory.js';
import { VERSION } from './version.js';

const folderOpen = JSON.stringify({ tasks: [{ command: 'tsc -w', runOptions: { runOn: 'folderOpen' } }] });

describe('scan', () => {
  it('returns clean for an empty tree', async () => {
    const result = await scanFiles({ 'README.md': '# hi' });
    expect(result.verdict).toBe('clean');
    expect(exitCodeFor(result.verdict)).toBe(0);
  });

  it('applies a trusted .dome.yml from the scanned tree in a full scan', async () => {
    const result = await scan({
      source: new MemorySource({ 'test/fixtures/x/.vscode/tasks.json': folderOpen, '.dome.yml': 'fixtures: ["test/fixtures/**"]' }),
      repoConfig: 'trusted',
    });
    expect(result.verdict).toBe('clean');
    expect(result.findings[0]).toMatchObject({ fixture: true });
  });

  describe('an untrusted .dome.yml (the default)', () => {
    const payload = {
      '.vscode/tasks.json': JSON.stringify({ tasks: [{ command: 'node public/f.woff2', runOptions: { runOn: 'folderOpen' } }] }),
      'public/f.woff2': 'DOME_FIXTURE_NOT_A_FONT',
    };

    it('cannot mark its own payload as a fixture', async () => {
      const result = await scan({ source: new MemorySource({ ...payload, '.dome.yml': 'fixtures: ["**"]' }) });
      expect(result.verdict).toBe('block');
      expect(result.findings.some((f) => f.fixture)).toBe(false);
    });

    it('cannot add allow entries or lower a severity', async () => {
      const tasks = new TextEncoder().encode(payload['.vscode/tasks.json']);
      const { sha256Hex } = await import('./hash.js');
      const config = [
        'allow:',
        '  - rule: DOME-VSC-004',
        '    file: .vscode/tasks.json',
        `    sha256: "${sha256Hex(tasks)}"`,
        '    reason: "DOME_FIXTURE"',
        'severity:',
        '  DOME-VSC-004: info',
        '  DOME-VSC-001: info',
      ].join('\n');
      const result = await scan({ source: new MemorySource({ ...payload, '.dome.yml': config }) });
      expect(result.verdict).toBe('block');
      expect(result.findings.find((f) => f.ruleId === 'DOME-VSC-004')).toMatchObject({ severity: 'block' });
      expect(result.findings.some((f) => f.allowed)).toBe(false);
    });

    it('can still raise a severity', async () => {
      const result = await scan({
        source: new MemorySource({ '.vscode/tasks.json': folderOpen, '.dome.yml': 'severity:\n  DOME-VSC-001: block' }),
      });
      expect(result.verdict).toBe('block');
    });

    it('is ignored when invalid instead of making the scan incomplete', async () => {
      const result = await scan({ source: new MemorySource({ '.dome.yml': 'nonsense: true' }) });
      expect(result.verdict).toBe('clean');
    });

    it('applies to the base tree in a diff scan too', async () => {
      const base = new MemorySource({ '.dome.yml': 'fixtures: ["**"]' });
      const head = new MemorySource({ '.vscode/tasks.json': folderOpen, '.dome.yml': 'fixtures: ["**"]' });
      const result = await scan({ source: head, diff: { base, changed: ['.vscode/tasks.json'] } });
      expect(result.verdict).toBe('review');
    });
  });

  it('reads .dome.yml from the base in a diff scan, so a change cannot loosen its own checks', async () => {
    const head = new MemorySource({ '.vscode/tasks.json': folderOpen, '.dome.yml': 'fixtures: ["**"]' });
    const result = await scan({
      source: head,
      diff: { base: new MemorySource({}), changed: ['.vscode/tasks.json', '.dome.yml'] },
      repoConfig: 'trusted',
    });
    expect(result.verdict).toBe('review');
  });

  it('treats an invalid .dome.yml as could-not-check', async () => {
    const result = await scan({ source: new MemorySource({ '.dome.yml': 'nonsense: true' }), repoConfig: 'trusted' });
    expect(result.verdict).toBe('incomplete');
    expect(result.incomplete).toEqual([{ path: '.dome.yml', reason: 'invalid-config' }]);
    expect(exitCodeFor(result.verdict)).toBe(3);
  });

  it('never reports clean when a relevant file could not be read', async () => {
    const result = await scan({
      source: new MemorySource({ '.vscode/tasks.json': 'x'.repeat(100) }),
      maxFileBytes: 10,
    });
    expect(result.verdict).toBe('incomplete');
    expect(result.incomplete).toEqual([{ path: '.vscode/tasks.json', reason: 'too-large' }]);
  });

  it('records symlinked auto-run files as not checked', async () => {
    const result = await scan({ source: new MemorySource({}, 'memory', ['.vscode/tasks.json']) });
    expect(result.verdict).toBe('incomplete');
  });

  it('reports a file nested too deeply to parse as could-not-check, not a crash', async () => {
    const result = await scanFiles({ '.vscode/tasks.json': '['.repeat(200_000) });
    expect(result.verdict).toBe('incomplete');
    expect(result.incomplete[0]).toMatchObject({ path: '.vscode/tasks.json', reason: 'parse-error' });
  });

  it('reports a workflow it cannot parse as could-not-check, not clean', async () => {
    const result = await scanFiles({ '.github/workflows/x.yml': 'on: push\njobs:\n  a:\n    x: [\n' });
    expect(result.verdict).toBe('incomplete');
    expect(result.incomplete).toEqual([{ path: '.github/workflows/x.yml', reason: 'parse-error' }]);
  });

  it('keeps scanning when a rule fails, and names the rule and file', async () => {
    const broken: Rule = {
      meta: { ...ALL_RULES[0]!.meta, id: 'DOME-TST-001' },
      async run(ctx) {
        await ctx.readText('a.txt');
        throw new Error('boom');
      },
    };
    const result = await scan({ source: new MemorySource({ 'a.txt': 'x', '.vscode/tasks.json': folderOpen }), rules: [broken, ...ALL_RULES] });
    expect(result.verdict).toBe('incomplete');
    expect(result.incomplete).toEqual([{ path: 'a.txt', reason: 'rule-error', ruleId: 'DOME-TST-001' }]);
    expect(result.findings.map((f) => f.ruleId)).toContain('DOME-VSC-001');
  });

  it('reads files that start with a UTF-8 byte order mark', async () => {
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const tasks = new Uint8Array([...bom, ...new TextEncoder().encode(folderOpen)]);
    const result = await scanFiles({ '.vscode/tasks.json': tasks });
    expect(result.findings.map((f) => f.ruleId)).toEqual(['DOME-VSC-001']);
    expect(result.findings[0]!.locations[0]!.line).toBe(1);
  });

  it('prefers block over incomplete', async () => {
    const result = await scan({
      source: new MemorySource({
        '.vscode/tasks.json': JSON.stringify({ tasks: [{ command: 'node public/a.woff2' }] }),
        '.dome.yml': ':',
      }),
      repoConfig: 'trusted',
    });
    expect(result.verdict).toBe('block');
  });
});

describe('rulesetHash', () => {
  it('is recorded in every result and changes with the rules or indicators', async () => {
    const { rulesetHash } = await import('./ruleset.js');
    const { EMPTY_INTEL } = await import('./types.js');
    const a = await scanFiles({ 'README.md': '' });
    expect(a.tool.rulesHash).toBe(rulesetHash(ALL_RULES, EMPTY_INTEL));
    expect(a.tool.rulesHash).toMatch(/^[0-9a-f]{64}$/);
    const withIntel = await scanFiles({ 'README.md': '' }, { intel: { packages: new Set(['dome-fixture-pkg']) } });
    expect(withIntel.tool.rulesHash).not.toBe(a.tool.rulesHash);
    expect(rulesetHash(ALL_RULES.slice(1), EMPTY_INTEL)).not.toBe(a.tool.rulesHash);
    const reordered = { ...EMPTY_INTEL, domains: ['b.invalid', 'a.invalid'] };
    expect(rulesetHash(ALL_RULES, reordered)).toBe(rulesetHash([...ALL_RULES].reverse(), { ...EMPTY_INTEL, domains: ['a.invalid', 'b.invalid'] }));
  });
});

describe('VERSION', () => {
  it('matches package.json', () => {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version: string };
    expect(VERSION).toBe(pkg.version);
  });
});
