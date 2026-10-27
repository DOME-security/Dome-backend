import { describe, expect, it } from 'vitest';
import { ConfigError, parseConfig } from './config.js';

const hash = 'a'.repeat(64);

describe('parseConfig', () => {
  it('parses fixtures, allow entries and severity overrides', () => {
    const config = parseConfig(`
fixtures:
  - test/fixtures/**
allow:
  - rule: DOME-VSC-001
    file: .vscode/tasks.json
    sha256: "${hash.toUpperCase()}"
    reason: "tsc --watch on folder open, reviewed"
severity:
  DOME-NPM-001: block
`);
    expect(config).toEqual({
      fixtures: ['test/fixtures/**'],
      allow: [{ rule: 'DOME-VSC-001', file: '.vscode/tasks.json', sha256: hash, reason: 'tsc --watch on folder open, reviewed' }],
      severity: { 'DOME-NPM-001': 'block' },
    });
  });

  it('accepts an empty file', () => {
    expect(parseConfig('')).toEqual({ fixtures: [], allow: [], severity: {} });
  });

  it.each([
    ['unknown keys', 'ignore: ["**"]'],
    ['allow without a hash', 'allow:\n  - rule: DOME-VSC-001\n    file: x\n    reason: y'],
    ['allow without a reason', `allow:\n  - rule: DOME-VSC-001\n    file: x\n    sha256: "${hash}"`],
    ['bad severity', 'severity:\n  DOME-NPM-001: off'],
    ['bad rule id', 'severity:\n  NPM-001: block'],
    ['duplicate keys', 'fixtures: []\nfixtures: []'],
    ['invalid YAML', 'fixtures: [\n'],
  ])('rejects %s', (_name, text) => {
    expect(() => parseConfig(text)).toThrow(ConfigError);
  });
});
