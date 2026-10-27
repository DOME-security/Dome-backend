import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { FsSource, scan } from '@dome-security/engine';
import { bundledIndicators, toIntelSet } from '@dome-security/intel';
import { afterAll, describe, expect, it } from 'vitest';

const root = path.join(import.meta.dirname, 'fixtures');
const scenarios = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

interface Expected {
  verdict: string;
  rules: string[];
}

/**
 * Files that are written into a temporary copy of the scenario at run time
 * instead of being committed, so the repository never holds a `.env` file.
 * Contents are inert: the value decodes to a `.invalid` domain.
 */
const generated: Record<string, Record<string, string>> = {
  'nextjs-env-exfiltration': {
    '.env': 'NEXT_PUBLIC_SITE=dome-fixture\nAPI_ENDPOINT=aHR0cHM6Ly9kb21lLWZpeHR1cmUuaW52YWxpZC9jb2xsZWN0\n',
  },
};

const scratch = mkdtempSync(path.join(tmpdir(), 'dome-scenarios-'));
afterAll(() => rmSync(scratch, { recursive: true, force: true }));

function materialize(name: string): string {
  const files = generated[name];
  if (!files) return path.join(root, name);
  const copy = path.join(scratch, name);
  cpSync(path.join(root, name), copy, { recursive: true });
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(copy, file)), { recursive: true });
    writeFileSync(path.join(copy, file), content);
  }
  return copy;
}

describe('scenario fixtures', () => {
  it('has scenarios', () => {
    expect(scenarios.length).toBeGreaterThanOrEqual(9);
  });

  it.each(scenarios)('%s', async (name) => {
    const expected = JSON.parse(readFileSync(path.join(root, name, 'expected.json'), 'utf8')) as Expected;
    const result = await scan({ source: new FsSource(materialize(name)), intel: toIntelSet(bundledIndicators()) });
    const rules = [...new Set(result.findings.flatMap((f) => [f.ruleId, ...f.relatedRules]))].sort();
    expect({ verdict: result.verdict, rules }).toEqual({ verdict: expected.verdict, rules: [...expected.rules].sort() });
  });
});
