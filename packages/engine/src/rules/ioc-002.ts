import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';

export default defineRule(
  {
    id: 'DOME-IOC-002',
    title: 'Published campaign marker',
    category: 'intel',
    severity: 'block',
    summary: 'Published campaign markers (for example the signatures in OpenSourceMalware\'s PolinRider YARA rule).',
    reasons: {
      marker: 'This file contains a byte sequence published as a marker of a known malware campaign.',
    },
    doc: {
      why: 'Obfuscated loaders change their hash on every copy but keep distinctive strings. Markers come from public research and live in `packages/intel` data files, never in rule code.',
      falsePositives: 'Security research repositories that store samples or YARA rules. Mark those paths as `fixtures`; indicator findings still block, so keep samples out of scanned repositories.',
      references: [REFS.polinRider],
    },
  },
  async (ctx) => {
    if (ctx.intel.markers.length === 0) return;
    const markers = ctx.intel.markers.map((m) => Buffer.from(m, 'utf8'));
    for (const { path } of targetsWhere(ctx, () => true)) {
      const bytes = await ctx.readBytes(path);
      if (!bytes) continue;
      const buf = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      for (const marker of markers) {
        const at = buf.indexOf(marker);
        if (at !== -1) {
          const text = await ctx.readText(path);
          ctx.report('marker', text === undefined ? { path } : ctx.locate(path, buf.subarray(0, at).toString('utf8').length));
          break;
        }
      }
    }
  },
);
