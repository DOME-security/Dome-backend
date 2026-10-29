import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import Ajv from 'ajv-draft-04';
import addFormats from 'ajv-formats';
import { describe, expect, it } from 'vitest';
import { scanFiles } from '../__fixtures__/run-rule.js';
import { formatSarif } from './sarif.js';

const schemaText = readFileSync(new URL('./__schemas__/sarif-schema-2.1.0.json', import.meta.url), 'utf8');
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(JSON.parse(schemaText) as object);

const trees: Record<string, Record<string, string>> = {
  block: {
    '.vscode/tasks.json': JSON.stringify({ tasks: [{ command: 'node public/a.woff2', runOptions: { runOn: 'folderOpen' } }] }),
    'public/a.woff2': 'DOME_FIXTURE_NOT_A_FONT',
  },
  review: { 'package.json': JSON.stringify({ scripts: { postinstall: 'node scripts/setup.js' } }), 'scripts/setup.js': '' },
  clean: { 'README.md': '# DOME_FIXTURE' },
  incomplete: { '.github/workflows/x.yml': 'jobs: [' },
  combined: {
    '.vscode/tasks.json': JSON.stringify({ tasks: [{ command: 'tsc -w', runOptions: { runOn: 'folderOpen' } }] }),
    'public/b.woff2': 'DOME_FIXTURE_NOT_A_FONT',
  },
  suppressed: { 'test/fixtures/.vscode/tasks.json': JSON.stringify({ tasks: [{ command: 'echo DOME_FIXTURE', runOptions: { runOn: 'folderOpen' } }] }) },
};

describe('SARIF output', () => {
  it('is checked against the unmodified official OASIS schema', () => {
    expect(createHash('sha256').update(schemaText).digest('hex')).toBe('c3b4bb2d6093897483348925aaa73af03b3e3f4bd4ca38cef26dcb4212a2682e');
  });

  it('rejects documents that break the schema, so the check is not vacuous', async () => {
    const sarif = JSON.parse(formatSarif(await scanFiles(trees.block!))) as { runs: { results: { level: string }[] }[] };
    sarif.runs[0]!.results[0]!.level = 'fatal';
    expect(validate(sarif)).toBe(false);
    expect(validate({ version: '2.1.0' })).toBe(false);
  });

  it.each(Object.keys(trees))('validates against the SARIF 2.1.0 schema (%s)', async (name) => {
    const config = name === 'suppressed' ? { fixtures: ['test/fixtures/**'], allow: [], severity: {} } : undefined;
    const result = await scanFiles(trees[name]!, config ? { config } : {});
    const sarif = JSON.parse(formatSarif(result)) as unknown;
    const ok = validate(sarif);
    expect(ok, JSON.stringify(validate.errors, null, 2)).toBe(true);
  });
});
