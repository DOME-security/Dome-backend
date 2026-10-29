import { fixtureMatcher, type DomeConfig } from './config.js';
import { SEVERITY_ORDER, type Finding, type Location } from './types.js';

/** Files that make a repository run something on its own. */
export const AUTORUN_SURFACES = new Set([
  'DOME-VSC-001',
  'DOME-NPM-001',
  'DOME-DEV-001',
  'DOME-AGT-001',
  'DOME-GHA-001',
  'DOME-GIT-002',
]);

/** Payload findings that become a block when an auto-run surface is present in the same scan. */
export const PAYLOAD_PARTNERS = new Set(['DOME-AST-001', 'DOME-CFG-001', 'DOME-CFG-003', 'DOME-ENV-001']);

/** The pairing that escalates in a full scan too. */
export const FULL_SCAN_SURFACES = new Set(['DOME-VSC-001']);
export const FULL_SCAN_PARTNERS = new Set(['DOME-AST-001']);

export const COMBINED_SUFFIX = ' An auto-run surface in the same change can trigger it.';

export function isIndicatorRule(ruleId: string): boolean {
  return ruleId.startsWith('DOME-IOC-');
}

export interface GradeInput {
  findings: Finding[];
  config: DomeConfig;
  /**
   * Whether `severity` overrides may lower a finding. False for configuration
   * read from an untrusted repository. Indicator findings are never lowered.
   */
  allowLowering?: boolean;
  /** Payload and surface findings only combine within one change (a diff scan). */
  scope: 'full' | 'diff';
  /** SHA-256 of a file in the scanned tree, for hash-pinned exceptions. */
  hashOf(path: string): Promise<string | undefined>;
}

function sameLocation(a: Location, b: Location): boolean {
  return a.path === b.path && a.line === b.line && a.column === b.column;
}

/**
 * Applies configuration and combines findings into final verdicts:
 *
 * 1. `severity` overrides from `.dome.yml` (never lowering an indicator block,
 *    and never lowering anything when the configuration is untrusted);
 * 2. fixture paths and hash-pinned `allow` entries drop to info;
 * 3. in a diff scan, a payload plus any auto-run surface in the same change
 *    escalates to block, and the surface findings are folded into it; in a
 *    full scan only a folder-open task plus a fake font does;
 * 4. a folder-open task, automatic tasks turned on and a hidden `.vscode`
 *    together escalate to block.
 */
export async function grade({ findings, config, allowLowering = true, scope, hashOf }: GradeInput): Promise<Finding[]> {
  const isFixture = fixtureMatcher(config);
  const out: Finding[] = [];

  for (const original of findings) {
    const f: Finding = { ...original, locations: [...original.locations], relatedRules: [...original.relatedRules] };
    const override = config.severity[f.ruleId];
    const lowers = override !== undefined && SEVERITY_ORDER[override] < SEVERITY_ORDER[f.severity];
    if (override && !(lowers && (!allowLowering || isIndicatorRule(f.ruleId)))) {
      f.severity = override;
    }
    if (!isIndicatorRule(f.ruleId)) {
      if (f.locations.length > 0 && f.locations.every((l) => isFixture(l.path))) {
        f.fixture = true;
        f.severity = 'info';
      } else {
        const primary = f.locations[0]?.path;
        const entry = config.allow.find((a) => a.rule === f.ruleId && a.file === primary);
        if (entry && primary && (await hashOf(primary)) === entry.sha256) {
          f.allowed = true;
          f.severity = 'info';
        }
      }
    }
    out.push(f);
  }

  const active = (f: Finding) => !f.fixture && !f.allowed;
  const absorbed = new Set<Finding>();

  // A fake font that another finding already points at (a task or script
  // running it) is folded into that finding: one row, both rules.
  for (const font of out) {
    if (font.ruleId !== 'DOME-AST-001' || !active(font)) continue;
    const path = font.locations[0]?.path;
    const runner = out.find(
      (f) => f !== font && active(f) && f.severity !== 'info' && f.locations.slice(1).some((l) => l.path === path),
    );
    if (!runner) continue;
    runner.relatedRules.push(font.ruleId);
    runner.relatedRules.sort();
    absorbed.add(font);
  }

  // In a diff scan any auto-run surface arms any payload in the same change.
  // In a full scan only the PolinRider pairing does: a folder-open task and a
  // fake font anywhere in the tree. Wider pairings across a whole tree would
  // mostly join unrelated files.
  const surfaceRules = scope === 'diff' ? AUTORUN_SURFACES : FULL_SCAN_SURFACES;
  const partnerRules = scope === 'diff' ? PAYLOAD_PARTNERS : FULL_SCAN_PARTNERS;
  const surfaces = out.filter((f) => active(f) && !absorbed.has(f) && surfaceRules.has(f.ruleId) && f.severity !== 'info');

  if (surfaces.length > 0) {
    for (const f of out) {
      if (!active(f) || absorbed.has(f) || !partnerRules.has(f.ruleId) || f.severity === 'block' || f.severity === 'info') continue;
      f.severity = 'block';
      f.reason += COMBINED_SUFFIX;
      for (const s of surfaces) {
        if (!f.relatedRules.includes(s.ruleId)) f.relatedRules.push(s.ruleId);
        for (const loc of s.locations) if (!f.locations.some((l) => sameLocation(l, loc))) f.locations.push(loc);
        absorbed.add(s);
      }
      f.relatedRules.sort();
    }
  }

  const byRule = (id: string) => out.find((f) => active(f) && !absorbed.has(f) && f.ruleId === id && f.severity !== 'info');
  const folderOpen = byRule('DOME-VSC-001');
  const autoTasks = byRule('DOME-VSC-002');
  const hidden = byRule('DOME-VSC-003');
  if (folderOpen && autoTasks && hidden) {
    folderOpen.severity = 'block';
    folderOpen.relatedRules.push('DOME-VSC-002', 'DOME-VSC-003');
    folderOpen.reason =
      'A task runs on folder open, automatic tasks are turned on so VS Code does not ask, and the .vscode folder is hidden from view.';
    folderOpen.locations.push(...autoTasks.locations, ...hidden.locations);
    absorbed.add(autoTasks);
    absorbed.add(hidden);
  }

  return out
    .filter((f) => !absorbed.has(f))
    .sort(
      (a, b) =>
        SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity] ||
        a.ruleId.localeCompare(b.ruleId) ||
        (a.locations[0]?.path ?? '').localeCompare(b.locations[0]?.path ?? '') ||
        (a.locations[0]?.line ?? 0) - (b.locations[0]?.line ?? 0),
    );
}
