import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { FsSource, scan } from '@dome-security/engine';
import { bundledIndicators, toIntelSet } from '@dome-security/intel';
import { describe, expect, it } from 'vitest';

const root = path.join(import.meta.dirname, 'fixtures');
const scenarios = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

interface Expected {
  verdict: string;
  rules: string[];
}

describe('scenario fixtures', () => {
  it('has scenarios', () => {
    expect(scenarios.length).toBeGreaterThanOrEqual(9);
  });

  it.each(scenarios)('%s', async (name) => {
    const dir = path.join(root, name);
    const expected = JSON.parse(readFileSync(path.join(dir, 'expected.json'), 'utf8')) as Expected;
    const result = await scan({ source: new FsSource(dir), intel: toIntelSet(bundledIndicators()) });
    const rules = [...new Set(result.findings.flatMap((f) => [f.ruleId, ...f.relatedRules]))].sort();
    expect({ verdict: result.verdict, rules }).toEqual({ verdict: expected.verdict, rules: [...expected.rules].sort() });
  });
});
