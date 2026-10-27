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
