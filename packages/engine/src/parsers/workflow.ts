import { parseDocument } from 'yaml';

export function isWorkflowFile(p: string): boolean {
  return /^\.github\/workflows\/[^/]+\.ya?ml$/.test(p);
}

export interface WorkflowStep {
  run?: string;
  uses?: string;
  with?: Record<string, unknown>;
}

export interface Workflow {
  /** Trigger event names. */
  events: string[];
  steps: WorkflowStep[];
}

/**
 * Parses a GitHub Actions workflow. Alias expansion is capped so a crafted
 * file cannot blow up memory. Returns undefined for files that are not valid
 * YAML mappings.
 */
export function parseWorkflow(text: string): Workflow | undefined {
  const doc = parseDocument(text, { strict: false, uniqueKeys: false, prettyErrors: false });
  if (doc.errors.length) return undefined;
  let data: unknown;
  try {
    data = doc.toJS({ maxAliasCount: 50 });
  } catch {
    return undefined;
  }
  if (!data || typeof data !== 'object') return undefined;
  const on = (data as Record<string, unknown>).on ?? (data as Record<string, unknown>).true;
  const events =
    typeof on === 'string' ? [on] : Array.isArray(on) ? on.map(String) : on && typeof on === 'object' ? Object.keys(on) : [];
  const steps: WorkflowStep[] = [];
  const jobs = (data as Record<string, unknown>).jobs;
  if (jobs && typeof jobs === 'object') {
    for (const job of Object.values(jobs as Record<string, unknown>)) {
      const jobSteps = (job as Record<string, unknown> | null)?.steps;
      if (!Array.isArray(jobSteps)) continue;
      for (const step of jobSteps) {
        if (!step || typeof step !== 'object') continue;
        const s = step as Record<string, unknown>;
        steps.push({
          run: typeof s.run === 'string' ? s.run : undefined,
          uses: typeof s.uses === 'string' ? s.uses : undefined,
          with: s.with && typeof s.with === 'object' ? (s.with as Record<string, unknown>) : undefined,
        });
      }
    }
  }
  return { events, steps };
}
