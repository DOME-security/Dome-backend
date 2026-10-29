import { describe, expect, it } from 'vitest';
import { scan } from '../scan.js';
import { MemorySource } from './memory.js';
import { resolveLinks } from './links.js';

const TASKS = JSON.stringify({ version: '2.0.0', tasks: [{ label: 'x', type: 'shell', command: 'echo DOME_FIXTURE', runOptions: { runOn: 'folderOpen' } }] });

async function verdictFor(files: Record<string, string>, links: Record<string, string>) {
  const result = await scan({ source: new MemorySource(files, 'memory', links) });
  return { verdict: result.verdict, rules: result.findings.map((f) => f.ruleId), incomplete: result.incomplete.map((i) => i.path) };
}

describe('symlinks inside the repository', () => {
  it('sees a linked .vscode directory, so it cannot hide a folder-open task', async () => {
    const r = await verdictFor({ 'shared/vscode/tasks.json': TASKS }, { '.vscode': 'shared/vscode' });
    expect(r.rules).toContain('DOME-VSC-001');
    expect(r.incomplete).toEqual([]);
  });

  it('sees a linked tasks.json file', async () => {
    const r = await verdictFor({ 'shared/tasks.json': TASKS }, { '.vscode/tasks.json': '../shared/tasks.json' });
    expect(r.rules).toContain('DOME-VSC-001');
  });

  it('follows a chain of links and stops at a loop', async () => {
    const chain = await verdictFor({ 'real/tasks.json': TASKS }, { '.vscode/tasks.json': 'a', '.vscode/a': 'b', '.vscode/b': '../real/tasks.json' });
    expect(chain.rules).toContain('DOME-VSC-001');
    const loop = await verdictFor({}, { '.vscode': '.vscode' });
    expect(loop.incomplete).toEqual(['.vscode']);
    expect(loop.verdict).toBe('incomplete');
  });

  it('reports links that leave the tree, are absolute or dangle as could-not-check', async () => {
    for (const target of ['../../outside', '/etc/passwd', 'missing/dir']) {
      const r = await verdictFor({}, { '.vscode': target });
      expect(r.verdict, target).toBe('incomplete');
    }
  });

  it('reports an unresolvable link only where it could hide auto-run files', async () => {
    const r = await verdictFor({ 'README.md': 'x' }, { 'docs/latest': '../../elsewhere' });
    expect(r.verdict).toBe('clean');
  });

  it('treats a link to a configuration file as that file', async () => {
    const files = { 'tools/base.config.js': 'module.exports = {};\n' };
    const r = await verdictFor(files, { 'root.oxlint.config.ts': 'tools/base.config.js' });
    expect(r.verdict).toBe('clean');
  });

  it('does not let a link shadow a real file', async () => {
    const { entries } = await resolveLinks(new MemorySource({ 'a/x': '1', 'b/x': '2' }, 'm', { b: 'a' }), await new MemorySource({ 'a/x': '1', 'b/x': '2' }, 'm', { b: 'a' }).list());
    expect(entries.filter((e) => e.path === 'b/x')).toHaveLength(1);
  });
});
