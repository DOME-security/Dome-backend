import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './cfg-002.js';

describe('DOME-CFG-002', () => {
  it('reports code pushed off-screen by padding', async () => {
    expect(await runRule(rule, { 'src/app.js': `const a = 1;${' '.repeat(200)}/* DOME_FIXTURE */ a;\n` })).toEqual(['review:padding@src/app.js:1']);
  });

  it('reports a single huge line in an otherwise normal file', async () => {
    const text = ['const a = 1;', ...Array(10).fill('a++;'), `const s = '${'x'.repeat(5000)}';`].join('\n');
    expect(await runRule(rule, { 'src/x.ts': text })).toEqual(['review:longLine@src/x.ts:12']);
  });

  it('skips minified bundles and config files', async () => {
    const padded = `a;${' '.repeat(500)}b;`;
    expect(await runRule(rule, { 'public/jquery.min.js': padded, 'vite.config.js': padded })).toEqual([]);
  });
});
