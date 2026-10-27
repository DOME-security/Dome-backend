import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './npm-002.js';

const pkg = (scripts: Record<string, string>) => JSON.stringify({ scripts });

describe('DOME-NPM-002', () => {
  it('blocks an install script that runs an asset', async () => {
    expect(await runRule(rule, { 'package.json': pkg({ postinstall: 'node public/fonts/a.woff2' }) })).toEqual([
      'block:nonScript@package.json:1',
    ]);
  });

  it('flags a script that runs a file missing from the repository', async () => {
    expect(await runRule(rule, { 'package.json': pkg({ preinstall: 'node .cache/x.js' }) })).toEqual(['review:missing@package.json:1']);
  });

  it('accepts tracked source and build outputs', async () => {
    const files = { 'package.json': pkg({ postinstall: 'node scripts/setup.js && node dist/install.js', prepare: 'sh ./hooks/install.sh' }), 'scripts/setup.js': '', 'hooks/install.sh': '' };
    expect(await runRule(rule, files)).toEqual([]);
  });

  it('ignores scripts that are not install hooks', async () => {
    expect(await runRule(rule, { 'package.json': pkg({ start: 'node missing.js' }) })).toEqual([]);
  });
});
