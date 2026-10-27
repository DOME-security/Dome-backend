import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import { buildWoff2 } from '../__fixtures__/fonts.js';
import rule from './ast-001.js';

describe('DOME-AST-001', () => {
  it('reports a font file that is really text', async () => {
    expect(await runRule(rule, { 'public/fonts/fa-solid-500.woff2': 'DOME_FIXTURE_NOT_A_FONT' })).toEqual([
      'review:notAFont@public/fonts/fa-solid-500.woff2',
    ]);
  });

  it('accepts real fonts, LFS pointers and empty files', async () => {
    const files = {
      'a.woff2': buildWoff2(),
      'b.ttf': 'version https://git-lfs.github.com/spec/v1\noid sha256:00\nsize 1\n',
      'c.woff': '',
    };
    expect(await runRule(rule, files)).toEqual([]);
  });
});
