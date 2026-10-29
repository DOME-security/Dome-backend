import { describe, expect, it } from 'vitest';
import { scanFiles } from './__fixtures__/run-rule.js';
import { findModuleTail, tokenize } from './parsers/js.js';
import { downloadsAndRuns, nodeInvocations, parseShellDeep } from './parsers/shell.js';
import vsc003, { hidesVscode } from './rules/vsc-003.js';

/**
 * Adversarial inputs that used to take quadratic time. At about 1 MB a
 * quadratic path takes tens of seconds; the bound below leaves room for slow
 * CI machines while still failing on a regression.
 */
const BOUND_MS = 3000;
const MB = 1024 * 1024;

function timed<T>(fn: () => T): { ms: number; value: T } {
  const start = performance.now();
  const value = fn();
  return { ms: performance.now() - start, value };
}

describe('linear time on adversarial input', () => {
  it('finds a config tail in a one-line module of a megabyte', () => {
    const text = `module.exports = ${'a+'.repeat(MB / 2)}a`;
    const { ms, value } = timed(() => findModuleTail(text));
    expect(value).toBeUndefined();
    expect(ms).toBeLessThan(BOUND_MS);
  });

  it('parses a long shell flag cluster', () => {
    const text = `sh -${'c'.repeat(MB)}X x`;
    const { ms } = timed(() => parseShellDeep(text));
    expect(ms).toBeLessThan(BOUND_MS);
  });

  it('checks a long exclude key made of open braces', async () => {
    const key = '{'.repeat(MB / 4);
    const start = performance.now();
    await scanFiles({ '.vscode/settings.json': JSON.stringify({ 'files.exclude': { [key]: true } }) }, { rules: [vsc003] });
    expect(performance.now() - start).toBeLessThan(BOUND_MS);
    expect(timed(() => hidesVscode(key)).value).toBe(false);
  });

  it.each([
    ['unterminated quotes', `"${'a'.repeat(MB)}`],
    ['nested substitutions', `${'$('.repeat(MB / 8)}x`],
    ['many pipes', 'curl x | '.repeat(MB / 16)],
    ['many backticks', '`'.repeat(MB)],
    ['many redirects', '2>&1 '.repeat(MB / 8)],
  ])('tokenizes shell %s', (_name, text) => {
    const { ms } = timed(() => {
      nodeInvocations(text);
      downloadsAndRuns(text);
    });
    expect(ms).toBeLessThan(BOUND_MS);
  });

  it.each([
    ['open template substitutions', '`${'.repeat(MB / 4)],
    ['unterminated block comment', `/*${'*'.repeat(MB)}`],
    ['regex-like slashes', '= /'.repeat(MB / 4)],
    ['many braces', '{'.repeat(MB)],
  ])('tokenizes JavaScript %s', (_name, text) => {
    const { ms } = timed(() => findModuleTail(`export default ${text}`, tokenize(`export default ${text}`)));
    expect(ms).toBeLessThan(BOUND_MS);
  });
});

describe('hidesVscode', () => {
  it.each([
    ['.vscode', true],
    ['**/.vscode', true],
    ['.vscode/**', true],
    ['**/tasks.json', true],
    ['{.git,.vscode}', true],
    ['**/{node_modules,vscode}', true],
    ['node_modules', false],
    ['{a,b}vscode', false],
    ['my-vscode-notes.md', false],
  ])('%s → %s', (pattern, expected) => {
    expect(hidesVscode(pattern)).toBe(expected);
  });
});
