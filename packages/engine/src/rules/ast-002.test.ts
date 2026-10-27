import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './ast-002.js';

describe('DOME-AST-002', () => {
  it('blocks npm scripts, shell scripts and workflow steps that run assets', async () => {
    const files = {
      'package.json': JSON.stringify({ scripts: { dev: 'node public/logo.png && next dev' } }),
      'scripts/start.sh': '#!/bin/sh\nnode ./public/fonts/a.woff2\n',
      '.github/workflows/x.yml': 'on: push\njobs:\n  a:\n    steps:\n      - run: node assets/a.ttf\n',
    };
    expect(await runRule(rule, files)).toEqual([
      'block:command@.github/workflows/x.yml:5',
      'block:command@package.json:1',
      'block:command@scripts/start.sh:2',
    ]);
  });

  it('blocks forking an asset and evaluating one', async () => {
    expect(await runRule(rule, { 'server.js': "require('child_process').fork('public/a.woff2')" })).toEqual(['block:fork@server.js:1']);
    const loader = "const s = fs.readFileSync('public/fonts/a.woff2', 'utf8');\nnew Function(s)();";
    expect(await runRule(rule, { 'lib/load.js': loader })).toEqual(['block:evaluated@lib/load.js:1']);
  });

  it('allows ordinary asset reads', async () => {
    expect(await runRule(rule, { 'app.js': "const logo = fs.readFileSync('logo.png'); res.send(logo);" })).toEqual([]);
  });
});
