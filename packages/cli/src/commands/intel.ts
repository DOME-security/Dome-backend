import { parseArgs } from 'node:util';
import { bundledIndicators, defaultCachePath, fetchIndicators, readCache, writeCache } from '@dome-security/intel';
import { UsageError, type Io } from '../io.js';

export const INTEL_HELP = `Usage: dome intel <update|status> [--api <url>]

  update   Download the active indicators from a Dome API server and cache them.
           Scans use bundled indicators plus this cache; they never fetch on their own.
  status   Show how many indicators are bundled and cached.

Options:
  --api <url>   Dome API server (default: $DOME_API_URL)
`;

export async function runIntel(args: string[], io: Io): Promise<number> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: { api: { type: 'string' }, help: { type: 'boolean', short: 'h', default: false } },
  });
  const [sub] = positionals;
  if (values.help || !sub) {
    io.stdout(INTEL_HELP);
    return values.help ? 0 : 64;
  }
  const cacheFile = io.env.DOME_INTEL_CACHE || defaultCachePath();
  if (sub === 'status') {
    const bundled = bundledIndicators();
    const cache = await readCache(cacheFile);
    io.stdout(`bundled: ${bundled.length} indicators\n`);
    io.stdout(cache ? `cached:  ${cache.indicators.length} indicators from ${cache.source} at ${cache.fetchedAt}\n` : 'cached:  none (run `dome intel update`)\n');
    return 0;
  }
  if (sub === 'update') {
    const api = values.api ?? io.env.DOME_API_URL;
    if (!api) throw new UsageError('set --api or DOME_API_URL to the Dome API server');
    const indicators = await fetchIndicators(api);
    await writeCache({ schemaVersion: 1, source: new URL(api).origin, fetchedAt: new Date().toISOString(), indicators }, cacheFile);
    io.stdout(`Saved ${indicators.length} indicators to ${cacheFile}\n`);
    return 0;
  }
  throw new UsageError(`unknown intel command: ${sub}`);
}
