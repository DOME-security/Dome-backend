import { sha256Hex } from '../hash.js';
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';

export default defineRule(
  {
    id: 'DOME-IOC-001',
    title: 'Known-bad file hash',
    category: 'intel',
    severity: 'block',
    summary: 'File hashes on the known-bad list (synced from the Dome Registry and public advisories).',
    reasons: {
      knownHash: 'This file is byte-for-byte identical to a known malicious file.',
    },
    doc: {
      why: 'Campaigns reuse the same loader files across many repositories. An exact hash match needs no interpretation, so it always blocks and cannot be lowered by `.dome.yml`.',
      falsePositives: 'None: a match is the same bytes. If an indicator was listed by mistake, it is revoked in the Dome Registry.',
      references: [REFS.polinRider],
    },
  },
  async (ctx) => {
    if (ctx.intel.hashes.size === 0) return;
    // Known payload files are small; skip files above the read limit rather than marking the scan incomplete.
    for (const { path } of targetsWhere(ctx, (p) => (ctx.tree.get(p)?.size ?? 0) <= ctx.maxFileBytes)) {
      const bytes = await ctx.readBytes(path);
      if (bytes && ctx.intel.hashes.has(sha256Hex(bytes))) ctx.report('knownHash', { path });
    }
  },
);
