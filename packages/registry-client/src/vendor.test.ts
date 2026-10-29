import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Keep in step with vendor/README.md. A mismatch means someone edited the
// generated bindings by hand or updated them without recording provenance.
const VENDORED: Record<string, string> = {
  'src/client.ts': '0292a457d72e4080a91e76137f3c85ae5cbbad8a7a792d35df67063d62dbd2f9',
  'src/index.ts': '37af556a87abd7980fc44ebaaf305c952d95baafadad4b29f17c81775c5bc41f',
  'src/types.ts': '4e7bfdd28ccdd39033bb9651ba2d385c3796b7bd25853c26175960c8db5c0454',
  'package.json': 'a345f5dab45ae68a9ce6f89e60a6b66a92b283fa630d1f4cb9b08f0c3ab75982',
  'README.md': '4175f471d165093001893823da0672df6b2bc736f8f535277e0fda3e38fcce70',
  'tsconfig.json': 'c1fd8097875729dcdcdd121c9735a1726b8b9a5e019d1c10e1f944e6a56136a2',
};

const dir = new URL('../vendor/registry-bindings/', import.meta.url);

describe('vendored registry bindings', () => {
  it.each(Object.entries(VENDORED))('%s is the unmodified generated file', (file, sha256) => {
    expect(createHash('sha256').update(readFileSync(new URL(file, dir))).digest('hex')).toBe(sha256);
  });

  it('are listed in vendor/README.md with the same hashes', () => {
    const readme = readFileSync(new URL('../vendor/README.md', import.meta.url), 'utf8');
    for (const [file, sha256] of Object.entries(VENDORED)) expect(readme).toContain(`${sha256}  registry-bindings/${file}`);
  });

  it('pin the stellar-sdk version they were generated with', () => {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { dependencies: Record<string, string> };
    expect(pkg.dependencies['@stellar/stellar-sdk']).toBe('17.2.1');
  });
});
