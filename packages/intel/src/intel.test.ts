import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { bundledIndicators, fetchIndicators, IndicatorError, loadIntel, readCache, toIntelSet, validateIndicator, writeCache } from './index.js';

const evidence = ['https://github.com/OpenSourceMalware/PolinRider'];

describe('bundled data', () => {
  it('validates every shipped indicator', () => {
    const indicators = bundledIndicators();
    expect(indicators.length).toBeGreaterThan(0);
    for (const i of indicators) expect(i.evidence.length).toBeGreaterThan(0);
  });
});

describe('validateIndicator', () => {
  it.each([
    { kind: 'hash', value: 'ABC', campaign: 'x', evidence },
    { kind: 'package', value: 'Bad Name', campaign: 'x', evidence },
    { kind: 'domain', value: 'not a domain', campaign: 'x', evidence },
    { kind: 'marker', value: 'short', campaign: 'x', evidence },
    { kind: 'package', value: 'ok', campaign: 'x', evidence: [] },
    { kind: 'package', value: 'ok', campaign: 'x', evidence: ['http://insecure.example'] },
    { kind: 'other', value: 'ok', campaign: 'x', evidence },
    { kind: 'hash', value: 'a'.repeat(64), campaign: 'x', evidence: ['sha256:xyz'] },
    { kind: 'hash', value: 'a'.repeat(64), campaign: 'x', evidence: ['stellar-tx:' + 'A'.repeat(64)] },
  ])('rejects %o', (raw) => {
    expect(() => validateIndicator(raw)).toThrow(IndicatorError);
  });

  it('accepts registry evidence: an advisory digest and the approval transaction', () => {
    const raw = { kind: 'hash', value: 'a'.repeat(64), campaign: 'demo', evidence: [`sha256:${'b'.repeat(64)}`, `stellar-tx:${'c'.repeat(64)}`] };
    expect(validateIndicator(raw).evidence).toHaveLength(2);
  });
});

describe('toIntelSet', () => {
  it('groups indicators by kind', () => {
    const set = toIntelSet([
      { kind: 'hash', value: 'a'.repeat(64), campaign: 'x', evidence },
      { kind: 'domain', value: 'dome-fixture.invalid', campaign: 'x', evidence },
    ]);
    expect(set.hashes.has('a'.repeat(64))).toBe(true);
    expect(set.domains).toEqual(['dome-fixture.invalid']);
  });
});

describe('cache', () => {
  it('round-trips and merges with bundled data', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'dome-intel-'));
    const file = path.join(dir, 'intel.json');
    try {
      expect(await readCache(file)).toBeUndefined();
      await writeCache(
        { schemaVersion: 1, source: 'test', fetchedAt: '2026-10-27T00:00:00Z', indicators: [{ kind: 'package', value: 'dome-fixture-evil', campaign: 'x', evidence }] },
        file,
      );
      const intel = await loadIntel({ cacheFile: file });
      expect(intel.packages.has('dome-fixture-evil')).toBe(true);
      expect(intel.packages.has('tailwindcss-style-animate')).toBe(true);
      await writeFile(file, '{"schemaVersion":2}');
      await expect(readCache(file)).rejects.toThrow(IndicatorError);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe('fetchIndicators', () => {
  it('follows cursors and validates entries', async () => {
    const pages: Record<string, unknown> = {
      '': { indicators: [{ kind: 'package', value: 'a-pkg', campaign: 'x', evidence }], nextCursor: 'p2' },
      p2: { indicators: [{ kind: 'domain', value: 'dome-fixture.invalid', campaign: 'x', evidence }], nextCursor: null },
    };
    const fake = (async (url: URL) => new Response(JSON.stringify(pages[url.searchParams.get('cursor') ?? '']))) as unknown as typeof fetch;
    const result = await fetchIndicators('https://api.example.invalid', fake);
    expect(result.map((i) => i.value)).toEqual(['a-pkg', 'dome-fixture.invalid']);
  });

  it('refuses plain http to remote hosts and invalid entries', async () => {
    await expect(fetchIndicators('http://api.example.invalid')).rejects.toThrow('https');
    const bad = (async () => new Response(JSON.stringify({ indicators: [{ kind: 'hash', value: 'x' }], nextCursor: null }))) as unknown as typeof fetch;
    await expect(fetchIndicators('https://api.example.invalid', bad)).rejects.toThrow(IndicatorError);
  });
});
