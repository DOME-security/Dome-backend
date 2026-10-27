import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './vsc-004.js';

const task = (command: unknown, extra: Record<string, unknown> = {}) =>
  JSON.stringify({ tasks: [{ type: 'shell', command, ...extra }] }, null, 2);

describe('DOME-VSC-004', () => {
  it('blocks a task that runs a font with node and points at the font', async () => {
    const files = { '.vscode/tasks.json': task('node public/fonts/fa-solid-500.woff2'), 'public/fonts/fa-solid-500.woff2': 'DOME_FIXTURE_NOT_A_FONT' };
    const result = await runRule(rule, files);
    expect(result).toEqual(['block:nonScript@.vscode/tasks.json:5']);
  });

  it.each([
    ['array form', task('node', { args: ['public/fonts/a.woff2'] })],
    ['sh -c', task('sh -c "node ./img/logo.png"')],
    ['--import', task('node --import ./a.ttf index.js')],
    ['stdin', task('cat public/a.woff | node -')],
    ['windows override', JSON.stringify({ tasks: [{ command: 'echo', windows: { command: 'node public\\fonts\\a.woff2' } }] })],
    ['eval of a font', task(`node -e "require('./public/a.woff2')"`)],
  ])('blocks the %s', async (_name, tasks) => {
    expect(await runRule(rule, { '.vscode/tasks.json': tasks })).toHaveLength(1);
  });

  it('follows npm tasks to package.json scripts', async () => {
    const files = {
      '.vscode/tasks.json': JSON.stringify({ tasks: [{ type: 'npm', script: 'setup' }] }),
      'package.json': JSON.stringify({ scripts: { setup: 'node public/a.woff2' } }),
    };
    expect(await runRule(rule, files)).toEqual(['block:nonScriptViaNpm@.vscode/tasks.json:1']);
  });

  it('allows tasks that run scripts', async () => {
    expect(await runRule(rule, { '.vscode/tasks.json': task('node scripts/dev.js && tsc --watch') })).toEqual([]);
  });
});
