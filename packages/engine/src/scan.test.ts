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

  it('reads .dome.yml from the scanned tree in a full scan', async () => {
    const result = await scan({
      source: new MemorySource({ 'test/fixtures/x/.vscode/tasks.json': folderOpen, '.dome.yml': 'fixtures: ["test/fixtures/**"]' }),
    });
    expect(result.verdict).toBe('clean');
    expect(result.findings[0]).toMatchObject({ fixture: true });
  });

  it('reads .dome.yml from the base in a diff scan, so a change cannot loosen its own checks', async () => {
    const head = new MemorySource({ '.vscode/tasks.json': folderOpen, '.dome.yml': 'fixtures: ["**"]' });
    const result = await scan({ source: head, diff: { base: new MemorySource({}), changed: ['.vscode/tasks.json', '.dome.yml'] } });
    expect(result.verdict).toBe('review');
  });

  it('treats an invalid .dome.yml as could-not-check', async () => {
    const result = await scan({ source: new MemorySource({ '.dome.yml': 'nonsense: true' }) });
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
