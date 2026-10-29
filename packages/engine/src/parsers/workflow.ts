import { parseDocument } from 'yaml';
import { UncheckableInput } from './errors.js';

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
 * file cannot blow up memory. Returns undefined for valid YAML that is not a
 * mapping (GitHub would not run it) and throws UncheckableInput for YAML this
 * parser cannot read, so the file is reported as not checked rather than clean.
 */
export function parseWorkflow(text: string): Workflow | undefined {
  let data: unknown;
  try {
    const doc = parseDocument(text, { strict: false, uniqueKeys: false, prettyErrors: false });
    if (doc.errors.length) throw new UncheckableInput('invalid YAML');
    data = doc.toJS({ maxAliasCount: 50 });
  } catch (error) {
    if (error instanceof UncheckableInput) throw error;
    throw new UncheckableInput('YAML could not be read');
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
