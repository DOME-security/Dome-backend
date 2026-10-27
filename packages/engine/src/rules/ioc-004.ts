import { defineRule, targetsWhere } from './rule.js';
import { executableCommands, isServerSideCode, REFS } from './shared.js';

const LABEL = /[a-z0-9-]/;

/** Offset of `domain` as a whole host name in `text` (already lowercase), or -1. */
export function findDomain(text: string, domain: string): number {
  let from = 0;
  for (;;) {
    const at = text.indexOf(domain, from);
    if (at === -1) return -1;
    const before = text[at - 1];
    const after = text[at + domain.length];
    if ((before === undefined || before === '.' || !LABEL.test(before)) && (after === undefined || !LABEL.test(after))) return at;
    from = at + 1;
  }
}

export default defineRule(
  {
    id: 'DOME-IOC-004',
    title: 'Known staging or C2 domain in an executable position',
    category: 'intel',
    severity: 'block',
    summary: 'Known staging and C2 domains in executable positions (tasks, scripts, hooks, workflows, config and route code).',
    reasons: {
      domain: 'Code that runs automatically contacts a domain known to host malware or command-and-control servers.',
    },
    doc: {
      why: 'Loaders fetch their second stage from a small set of staging hosts. A known host in a task, script, hook or config file means the repository reaches out to attacker infrastructure.',
      falsePositives: 'None for listed domains. Mentions in documentation are not scanned.',
      references: [REFS.polinRider, REFS.microsoftNext],
    },
  },
  async (ctx) => {
    if (ctx.intel.domains.length === 0) return;
    const commands = await executableCommands(ctx, new Set(['task', 'npm', 'devcontainer', 'workflow', 'shell']));
    const seen = new Set<string>();
    for (const cmd of commands) {
      const lower = cmd.text.toLowerCase();
      for (const domain of ctx.intel.domains) {
        if (findDomain(lower, domain) === -1) continue;
        const key = `${cmd.path}\0${cmd.offset}`;
        if (!seen.has(key)) ctx.report('domain', ctx.locate(cmd.path, cmd.offset));
        seen.add(key);
      }
    }
    for (const { path } of targetsWhere(ctx, isServerSideCode)) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      const lower = text.toLowerCase();
      for (const domain of ctx.intel.domains) {
        const at = findDomain(lower, domain);
        if (at !== -1) {
          ctx.report('domain', ctx.locate(path, at));
          break;
        }
      }
    }
  },
);
