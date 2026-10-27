import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ruleDocFiles } from './rule-docs.js';
import { ALL_RULES } from './rules/index.js';

const dir = new URL('../../../docs/rules/', import.meta.url);

describe('docs/rules', () => {
  it('is up to date with rule metadata (run pnpm docs:rules)', () => {
    const files = ruleDocFiles();
    expect(readdirSync(dir).filter((f) => f.endsWith('.md')).sort()).toEqual(Object.keys(files).sort());
    for (const [name, content] of Object.entries(files)) expect(readFileSync(new URL(name, dir), 'utf8'), name).toBe(content);
  });
});

describe('rule metadata', () => {
  it('has unique, well-formed ids and complete documentation', () => {
    const ids = ALL_RULES.map((r) => r.meta.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const { meta } of ALL_RULES) {
      expect(meta.id).toMatch(/^DOME-[A-Z]{3}-\d{3}$/);
      expect(Object.keys(meta.reasons).length).toBeGreaterThan(0);
      expect(meta.doc.why.length).toBeGreaterThan(40);
      expect(meta.doc.references.length).toBeGreaterThan(0);
      for (const r of meta.doc.references) expect(r.url).toMatch(/^https:\/\//);
      for (const reason of Object.values(meta.reasons)) expect(reason).toMatch(/^\S.*\.$/);
    }
  });
});
