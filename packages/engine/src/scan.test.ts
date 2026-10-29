import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { scanFiles } from './__fixtures__/run-rule.js';
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

describe('VERSION', () => {
  it('matches package.json', () => {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version: string };
    expect(VERSION).toBe(pkg.version);
  });
});
