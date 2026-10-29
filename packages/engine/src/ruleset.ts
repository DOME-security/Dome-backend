import { createHash } from 'node:crypto';
import type { Rule } from './rules/rule.js';
import type { IntelSet } from './types.js';
import { VERSION } from './version.js';

/**
 * SHA-256 of the rule set and indicator set a scan used: the engine
 * version, each rule's id, levels and fixed wording, and every indicator.
 * Published with each Dome Registry attestation (the contract's `rules`
 * field) so a verdict can be tied to exactly what was checked.
 */
export function rulesetHash(rules: readonly Rule[], intel: IntelSet): string {
  const sorted = (values: Iterable<string>) => [...values].sort();
  const canonical = JSON.stringify({
    engine: VERSION,
    rules: rules
      .map(({ meta }) => [meta.id, meta.severity, Object.entries(meta.reasons).sort(([a], [b]) => (a < b ? -1 : 1))] as const)
      .sort(([a], [b]) => (a < b ? -1 : 1)),
    intel: {
      hashes: sorted(intel.hashes),
      markers: sorted(intel.markers),
      packages: sorted(intel.packages),
      domains: sorted(intel.domains),
    },
  });
  return createHash('sha256').update(canonical).digest('hex');
}
