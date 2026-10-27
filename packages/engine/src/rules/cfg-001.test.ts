import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './cfg-001.js';

describe('DOME-CFG-001', () => {
  it('blocks code hidden after whitespace padding in postcss.config.mjs', async () => {
    const config = `export default {\n  plugins: { tailwindcss: {} },\n};${' '.repeat(300)}globalThis.DOME_FIXTURE = 1; /* DOME_FIXTURE */\n`;
    expect(await runRule(rule, { 'postcss.config.mjs': config })).toEqual(['block:paddedTail@postcss.config.mjs:3']);
  });

  it('reviews unpadded code after module.exports', async () => {
    const config = 'module.exports = {\n  content: [],\n}\nconsole.log("DOME_FIXTURE")\n';
    expect(await runRule(rule, { 'tailwind.config.js': config })).toEqual(['review:tail@tailwind.config.js:4']);
  });

  it('accepts ordinary configs', async () => {
    const files = {
      'next.config.mjs': "/** @type {import('next').NextConfig} */\nconst nextConfig = {};\n\nexport default nextConfig;\n",
      'vite.config.ts': "import { defineConfig } from 'vite';\nexport default defineConfig({\n  plugins: [],\n});\n",
    };
    expect(await runRule(rule, files)).toEqual([]);
  });
});

describe('DOME-CFG-001 regressions from the false-positive corpus', () => {
  it('ignores helper declarations after export default (prettier/website/vite.config.mjs)', async () => {
    const config = 'export default defineConfig({\n  plugins: [],\n});\n\nfunction buildCdnAlias() {\n  return {};\n}\nconst x = 1;\n';
    expect(await runRule(rule, { 'vite.config.mjs': config })).toEqual([]);
  });

  it('treats module.exports = function () {}; as one statement (vscode-extension-samples webpack config)', async () => {
    const config = "module.exports = function withDefaults(extConfig) {\n  return merge({}, extConfig);\n};\n";
    expect(await runRule(rule, { 'shared.webpack.config.js': config })).toEqual([]);
  });

  it('ignores further module.exports assignments', async () => {
    expect(await runRule(rule, { 'a.config.js': 'module.exports = {};\nmodule.exports.extra = 1;\n' })).toEqual([]);
  });

  it('still blocks a padded declaration', async () => {
    const config = `export default {};${' '.repeat(200)}const DOME_FIXTURE = 1;\n`;
    expect(await runRule(rule, { 'next.config.mjs': config })).toEqual(['block:paddedTail@next.config.mjs:1']);
  });
});
