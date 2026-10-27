import { createHash } from 'node:crypto';
import { ALL_RULES } from '../rules/index.js';
import type { Finding, ScanResult, Severity } from '../types.js';
import { HONESTY_NOTICE, ruleDocUrl } from './common.js';

const LEVEL: Record<Severity, 'error' | 'warning' | 'note'> = { block: 'error', review: 'warning', info: 'note' };

function uri(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

function physical(path: string, line?: number, column?: number) {
  return {
    physicalLocation: {
      artifactLocation: { uri: uri(path), uriBaseId: '%SRCROOT%' },
      ...(line ? { region: { startLine: line, ...(column ? { startColumn: column } : {}) } } : {}),
    },
  };
}

function fingerprint(f: Finding): string {
  const key = [f.ruleId, f.reasonKey, ...f.locations.map((l) => l.path)].join('\0');
  return createHash('sha256').update(key).digest('hex').slice(0, 32);
}

/** SARIF 2.1.0 for GitHub code scanning and other SARIF consumers. */
export function formatSarif(result: ScanResult): string {
  const rules = ALL_RULES.map((r) => ({
    id: r.meta.id,
    name: r.meta.title.replace(/[^A-Za-z0-9]+/g, ' ').trim().replace(/ (\w)/g, (_m, ch: string) => ch.toUpperCase()),
    shortDescription: { text: r.meta.title },
    fullDescription: { text: r.meta.summary.replace(/`/g, '') },
    helpUri: ruleDocUrl(r.meta.id),
    help: { text: r.meta.doc.why, markdown: `${r.meta.doc.why}\n\n**False positives:** ${r.meta.doc.falsePositives}` },
    defaultConfiguration: { level: LEVEL[r.meta.severity] },
    properties: { tags: ['security', r.meta.category], 'security-severity': r.meta.severity === 'block' ? '9.0' : r.meta.severity === 'review' ? '5.0' : '1.0' },
  }));
  const ruleIndex = new Map(rules.map((r, i) => [r.id, i]));

  const results = result.findings.map((f) => {
    const [primary, ...related] = f.locations;
    return {
      ruleId: f.ruleId,
      ruleIndex: ruleIndex.get(f.ruleId),
      level: LEVEL[f.severity],
      message: { text: f.relatedRules.length ? `${f.reason} (combined with ${f.relatedRules.join(', ')})` : f.reason },
      locations: primary ? [physical(primary.path, primary.line, primary.column)] : [],
      ...(related.length
        ? { relatedLocations: related.map((l, id) => ({ id, ...physical(l.path, l.line, l.column) })) }
        : {}),
      partialFingerprints: { 'domeFinding/v1': fingerprint(f) },
      ...(f.allowed || f.fixture
        ? { suppressions: [{ kind: 'external', justification: f.allowed ? 'Hash-pinned allow entry in .dome.yml' : 'Fixture path in .dome.yml' }] }
        : {}),
      properties: { verdict: f.severity },
    };
  });

  const sarif = {
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    version: '2.1.0',
    runs: [
      {
        tool: {
          driver: {
            name: 'Dome',
            semanticVersion: result.tool.version,
            informationUri: 'https://github.com/dome-security/dome-backend',
            rules,
          },
        },
        invocations: [
          {
            executionSuccessful: result.verdict !== 'incomplete',
            toolExecutionNotifications: result.incomplete.map((i) => ({
              level: 'warning',
              message: { text: `Could not check this file (${i.reason}).` },
              locations: [physical(i.path)],
            })),
          },
        ],
        results,
        properties: { verdict: result.verdict, notice: HONESTY_NOTICE },
      },
    ],
  };
  return `${JSON.stringify(sarif, null, 2)}\n`;
}
