import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import type { IntelSet } from '@dome-security/engine';
import domains from './data/domains.json' with { type: 'json' };
import hashes from './data/hashes.json' with { type: 'json' };
import markers from './data/markers.json' with { type: 'json' };
import packages from './data/packages.json' with { type: 'json' };
import { IndicatorError, validateIndicator, validateIndicatorFile, type Indicator } from './indicators.js';

export * from './indicators.js';

/** Indicators shipped with this release, validated on load. */
export function bundledIndicators(): Indicator[] {
  return [
    ...validateIndicatorFile(hashes, 'hashes.json'),
    ...validateIndicatorFile(markers, 'markers.json'),
    ...validateIndicatorFile(packages, 'packages.json'),
    ...validateIndicatorFile(domains, 'domains.json'),
  ];
}

/** Builds the lookup structure the engine matches against. */
export function toIntelSet(indicators: readonly Indicator[]): IntelSet {
  const set = { hashes: new Set<string>(), markers: [] as string[], packages: new Set<string>(), domains: [] as string[] };
  for (const i of indicators) {
    if (i.kind === 'hash') set.hashes.add(i.value);
    else if (i.kind === 'marker' && !set.markers.includes(i.value)) set.markers.push(i.value);
    else if (i.kind === 'package') set.packages.add(i.value);
    else if (i.kind === 'domain' && !set.domains.includes(i.value)) set.domains.push(i.value);
  }
  return set;
}

export function defaultCachePath(): string {
  const base = process.env.XDG_CACHE_HOME || path.join(os.homedir(), '.cache');
  return path.join(base, 'dome', 'intel.json');
}

export interface IntelCache {
  schemaVersion: 1;
  source: string;
  fetchedAt: string;
  indicators: Indicator[];
}

/** Reads indicators saved by `dome intel update`. A missing cache is empty; a corrupt one is an error. */
export async function readCache(file = defaultCachePath()): Promise<IntelCache | undefined> {
  let text: string;
  try {
    text = await readFile(file, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
  const raw = JSON.parse(text) as Partial<IntelCache>;
  if (raw.schemaVersion !== 1 || !Array.isArray(raw.indicators)) throw new IndicatorError(`${file} is not a Dome intel cache`);
  return {
    schemaVersion: 1,
    source: String(raw.source),
    fetchedAt: String(raw.fetchedAt),
    indicators: raw.indicators.map((i, n) => validateIndicator(i, `cache.indicators[${n}]`)),
  };
}

export async function writeCache(cache: IntelCache, file = defaultCachePath()): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify(cache, null, 2)}\n`, { mode: 0o644 });
  await rename(tmp, file);
}

/**
 * Bundled indicators plus anything saved by an explicit `dome intel update`.
 * Loading never touches the network, so scans stay deterministic.
 */
export async function loadIntel(options: { cacheFile?: string; useCache?: boolean } = {}): Promise<IntelSet> {
  const indicators = bundledIndicators();
  if (options.useCache !== false) {
    const cache = await readCache(options.cacheFile);
    if (cache) indicators.push(...cache.indicators);
  }
  return toIntelSet(indicators);
}

export interface IndicatorPage {
  indicators: unknown[];
  nextCursor: string | null;
}

/**
 * Downloads the active indicator list from a Dome API server
 * (`GET /v1/indicators`), validating every entry.
 */
export async function fetchIndicators(
  apiUrl: string,
  fetchImpl: typeof fetch = fetch,
  maxPages = 100,
): Promise<Indicator[]> {
  const base = new URL(apiUrl);
  if (base.protocol !== 'https:' && base.hostname !== 'localhost' && base.hostname !== '127.0.0.1') {
    throw new IndicatorError('the Dome API URL must use https');
  }
  const out: Indicator[] = [];
  let cursor: string | null = null;
  for (let page = 0; page < maxPages; page++) {
    const url = new URL('/v1/indicators', base);
    url.searchParams.set('limit', '500');
    if (cursor) url.searchParams.set('cursor', cursor);
    const res = await fetchImpl(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(30_000) });
    if (!res.ok) throw new IndicatorError(`indicator request failed with HTTP ${res.status}`);
    const body = (await res.json()) as IndicatorPage;
    if (!Array.isArray(body.indicators)) throw new IndicatorError('unexpected indicator response');
    body.indicators.forEach((i, n) => out.push(validateIndicator(i, `response.indicators[${n}]`)));
    cursor = body.nextCursor;
    if (!cursor) return out;
  }
  throw new IndicatorError('too many indicator pages');
}
