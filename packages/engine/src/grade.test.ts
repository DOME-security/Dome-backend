import { describe, expect, it } from 'vitest';
import { EMPTY_CONFIG, type DomeConfig } from './config.js';
import { COMBINED_SUFFIX, grade } from './grade.js';
import type { Finding, Severity } from './types.js';

const finding = (ruleId: string, severity: Severity, path: string): Finding => ({
  ruleId,
  severity,
  relatedRules: [],
  reasonKey: 'x',
  reason: 'Reason.',
  locations: [{ path }],
});

const run = (findings: Finding[], config: DomeConfig = EMPTY_CONFIG, hashes: Record<string, string> = {}) =>
  grade({ findings, config, scope: 'diff', hashOf: async (p) => hashes[p] });

describe('grade', () => {
  it('never lowers a severity when lowering is not allowed', async () => {
    const config: DomeConfig = { ...EMPTY_CONFIG, severity: { 'DOME-VSC-004': 'info', 'DOME-VSC-001': 'block' } };
    const out = await grade({
      findings: [finding('DOME-VSC-004', 'block', '.vscode/tasks.json'), finding('DOME-VSC-001', 'review', '.vscode/tasks.json')],
      config,
      allowLowering: false,
      scope: 'full',
      hashOf: async () => undefined,
    });
    expect(out.map((f) => `${f.ruleId}:${f.severity}`)).toEqual(['DOME-VSC-001:block', 'DOME-VSC-004:block']);
  });

  it('keeps a folder-open task alone at review', async () => {
    const [f] = await run([finding('DOME-VSC-001', 'review', '.vscode/tasks.json')]);
    expect(f!.severity).toBe('review');
  });

  it('combines an auto-run surface with a fake font into one block', async () => {
    const out = await run([
      finding('DOME-VSC-001', 'review', '.vscode/tasks.json'),
      finding('DOME-AST-001', 'review', 'public/fonts/a.woff2'),
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({
      ruleId: 'DOME-AST-001',
      relatedRules: ['DOME-VSC-001'],
      severity: 'block',
      reason: `Reason.${COMBINED_SUFFIX}`,
      locations: [{ path: 'public/fonts/a.woff2' }, { path: '.vscode/tasks.json' }],
    });
  });

  it('combines a folder-open task with a fake font in a full scan too', async () => {
    const out = await grade({
      findings: [finding('DOME-VSC-001', 'review', '.vscode/tasks.json'), finding('DOME-AST-001', 'review', 'public/a.woff2')],
      config: EMPTY_CONFIG,
      scope: 'full',
      hashOf: async () => undefined,
    });
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ ruleId: 'DOME-AST-001', relatedRules: ['DOME-VSC-001'], severity: 'block' });
  });

  it('does not join other surfaces and payloads across a full tree', async () => {
    const out = await grade({
      findings: [finding('DOME-NPM-001', 'review', 'package.json'), finding('DOME-AST-001', 'review', 'public/a.woff2')],
      config: EMPTY_CONFIG,
      scope: 'full',
      hashOf: async () => undefined,
    });
    expect(out.map((f) => f.severity)).toEqual(['review', 'review']);
  });

  it('escalates the RMG-Py combination of folder-open, automatic tasks and hidden .vscode', async () => {
    const out = await run([
      finding('DOME-VSC-001', 'review', '.vscode/tasks.json'),
      finding('DOME-VSC-002', 'review', '.vscode/settings.json'),
      finding('DOME-VSC-003', 'review', '.vscode/settings.json'),
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ ruleId: 'DOME-VSC-001', severity: 'block', relatedRules: ['DOME-VSC-002', 'DOME-VSC-003'] });
  });

  it('applies severity overrides but never lowers an indicator block', async () => {
    const config = { ...EMPTY_CONFIG, severity: { 'DOME-NPM-001': 'block', 'DOME-IOC-001': 'info' } as const };
    const out = await run([finding('DOME-NPM-001', 'review', 'package.json'), finding('DOME-IOC-001', 'block', 'x')], config);
    expect(out.map((f) => f.severity)).toEqual(['block', 'block']);
  });

  it('drops fixture findings to info, except indicators', async () => {
    const config = { ...EMPTY_CONFIG, fixtures: ['test/fixtures/**'] };
    const out = await run(
      [finding('DOME-VSC-004', 'block', 'test/fixtures/a/.vscode/tasks.json'), finding('DOME-IOC-002', 'block', 'test/fixtures/b.js')],
      config,
    );
    expect(out.map((f) => [f.ruleId, f.severity, f.fixture ?? false])).toEqual([
      ['DOME-IOC-002', 'block', false],
      ['DOME-VSC-004', 'info', true],
    ]);
  });

  it('honours an allow entry only while the file hash matches', async () => {
    const config = {
      ...EMPTY_CONFIG,
      allow: [{ rule: 'DOME-VSC-001', file: '.vscode/tasks.json', sha256: 'a'.repeat(64), reason: 'reviewed' }],
    };
    const f = finding('DOME-VSC-001', 'review', '.vscode/tasks.json');
    expect((await run([f], config, { '.vscode/tasks.json': 'a'.repeat(64) }))[0]).toMatchObject({ allowed: true, severity: 'info' });
    expect((await run([f], config, { '.vscode/tasks.json': 'b'.repeat(64) }))[0]).toMatchObject({ severity: 'review' });
  });

  it('does not let an allowed surface escalate a payload', async () => {
    const config = {
      ...EMPTY_CONFIG,
      allow: [{ rule: 'DOME-VSC-001', file: '.vscode/tasks.json', sha256: 'a'.repeat(64), reason: 'reviewed' }],
    };
    const out = await run(
      [finding('DOME-VSC-001', 'review', '.vscode/tasks.json'), finding('DOME-CFG-001', 'review', 'next.config.js')],
      config,
      { '.vscode/tasks.json': 'a'.repeat(64) },
    );
    expect(out.find((f) => f.ruleId === 'DOME-CFG-001')!.severity).toBe('review');
  });
});

describe('grade: folding', () => {
  it('folds a fake font into the finding that runs it', async () => {
    const runner: Finding = { ...finding('DOME-VSC-004', 'block', '.vscode/tasks.json'), locations: [{ path: '.vscode/tasks.json', line: 3 }, { path: 'public/a.woff2' }] };
    const out = await run([runner, finding('DOME-AST-001', 'review', 'public/a.woff2')]);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ ruleId: 'DOME-VSC-004', relatedRules: ['DOME-AST-001'], severity: 'block' });
  });
});

describe('grade: scope', () => {
  it('does not combine findings across a whole repository in a full scan', async () => {
    const out = await grade({
      findings: [finding('DOME-GHA-001', 'review', '.github/workflows/a.yml'), finding('DOME-CFG-001', 'review', 'website/vite.config.mjs')],
      config: EMPTY_CONFIG,
      scope: 'full',
      hashOf: async () => undefined,
    });
    expect(out.map((f) => f.severity)).toEqual(['review', 'review']);
  });
});
