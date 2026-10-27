import { describe, expect, it } from 'vitest';
import { scanFiles } from '../__fixtures__/run-rule.js';
import type { ScanResult } from '../types.js';
import { formatJson, formatMarkdown, formatSarif, formatText, HONESTY_NOTICE } from './index.js';

const polinRiderLike = {
  '.vscode/tasks.json': JSON.stringify(
    { tasks: [{ command: 'node public/fonts/fa-solid-500.woff2', runOptions: { runOn: 'folderOpen' }, presentation: { reveal: 'never' } }] },
    null,
    2,
  ),
  '.vscode/settings.json': '{"task.allowAutomaticTasks":"on"}',
  'public/fonts/fa-solid-500.woff2': 'DOME_FIXTURE_NOT_A_FONT',
};

async function result(): Promise<ScanResult> {
  return scanFiles(polinRiderLike);
}

describe('reporters', () => {
  it('render the same verdict in every format and end with the honesty notice', async () => {
    const r = await result();
    expect(r.verdict).toBe('block');
    expect(formatText(r)).toContain('Verdict: BLOCK');
    expect(formatText(r).trimEnd().endsWith(HONESTY_NOTICE)).toBe(true);
    expect(formatMarkdown(r).trimEnd().endsWith(HONESTY_NOTICE)).toBe(true);
    expect(JSON.parse(formatJson(r))).toMatchObject({ verdict: 'block', notice: HONESTY_NOTICE });
  });

  it('writes a maintainer-facing markdown summary', async () => {
    const md = formatMarkdown(await result());
    expect(md).toContain('### 🔴 Dome: merge blocked');
    expect(md).toContain('[DOME-VSC-001](https://github.com/dome-security/dome-backend/blob/main/docs/rules/DOME-VSC-001.md) + [DOME-AST-001]');
    expect(md).toContain('**Do not check out this branch in VS Code, Cursor, or with `npm install`.**');
  });

  it('produces valid SARIF 2.1.0 with rule metadata and levels', async () => {
    const sarif = JSON.parse(formatSarif(await result()));
    expect(sarif.version).toBe('2.1.0');
    const run = sarif.runs[0];
    expect(run.tool.driver.rules.length).toBeGreaterThanOrEqual(27);
    expect(run.results.map((x: { level: string }) => x.level)).toContain('error');
    for (const res of run.results) expect(run.tool.driver.rules[res.ruleIndex].id).toBe(res.ruleId);
  });

  it('neutralizes hostile file names', async () => {
    const r = await scanFiles({ 'x|<img src=x onerror=alert(1)>\u001b[2J\u202e.woff2': 'DOME_FIXTURE_NOT_A_FONT' });
    const md = formatMarkdown(r);
    expect(md).not.toContain('<img');
    expect(md).toContain('&#124;');
    expect(formatText(r)).not.toContain('\u001b[2J');
    expect(formatText(r)).not.toContain('\u202e');
  });
});
