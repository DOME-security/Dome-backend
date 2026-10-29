import { UncheckableInput } from '../parsers/errors.js';
import { isWorkflowFile, parseWorkflow, type Workflow } from '../parsers/workflow.js';
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';

const SECRET = /\$\{\{\s*secrets\.|toJSON\(\s*secrets\s*\)/i;
const NETWORK_TOOL = /\b(?:curl|wget|Invoke-WebRequest|Invoke-RestMethod|iwr|irm|nc|ncat)\b/i;
const RAW_IP_URL = /\bhttps?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
const PR_HEAD_REF = /github\.event\.pull_request\.head\.(?:sha|ref)|github\.head_ref/;

export default defineRule(
  {
    id: 'DOME-GHA-001',
    title: 'Workflow added, changed or risky',
    category: 'autorun',
    severity: 'review',
    summary:
      'New or changed workflow under `.github/workflows/`, weighted up for `pull_request_target`, secrets passed to `curl`/`wget`, or posting to raw IPs.',
    reasons: {
      changed: 'A GitHub Actions workflow was added or changed.',
      pullRequestTarget: 'The workflow runs on pull_request_target, with write access and secrets, for pull requests from forks.',
      checksOutPrHead: 'The workflow runs on pull_request_target and checks out the pull request\'s own code.',
      secretsToNetwork: 'A workflow step sends repository secrets to a network tool.',
      rawIp: 'A workflow step contacts a raw IP address.',
    },
    doc: {
      why: 'GhostAction added workflows that read every repository secret and posted them to an attacker server. `pull_request_target` combined with a checkout of the pull request runs untrusted code with write access.',
      falsePositives:
        'Every honest workflow change is reported for review in a diff scan. Deployment steps that pass a single secret to `curl` for an API call will also be flagged; check the destination.',
      references: [REFS.ghostAction, REFS.actionsHardening],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, isWorkflowFile)) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      let wf: Workflow | undefined;
      try {
        wf = parseWorkflow(text);
      } catch (error) {
        if (!(error instanceof UncheckableInput)) throw error;
        ctx.couldNotCheck(path, 'parse-error');
        continue;
      }
      const loc = (needle: string | RegExp) => {
        const index = typeof needle === 'string' ? text.indexOf(needle) : text.search(needle);
        return ctx.locate(path, Math.max(0, index));
      };
      let reported = false;
      if (wf?.events.includes('pull_request_target')) {
        const checksOutHead = wf.steps.some(
          (s) => s.uses?.startsWith('actions/checkout') && PR_HEAD_REF.test(String(s.with?.ref ?? '')),
        );
        if (checksOutHead) ctx.report('checksOutPrHead', loc(PR_HEAD_REF), 'block');
        else ctx.report('pullRequestTarget', loc('pull_request_target'));
        reported = true;
      }
      for (const step of wf?.steps ?? []) {
        if (!step.run) continue;
        const firstLine = step.run.split('\n', 1)[0]!.trim();
        if (SECRET.test(step.run) && NETWORK_TOOL.test(step.run)) {
          ctx.report('secretsToNetwork', loc(firstLine), 'block');
          reported = true;
        }
        if (RAW_IP_URL.test(step.run)) {
          ctx.report('rawIp', loc(RAW_IP_URL), 'block');
          reported = true;
        }
      }
      if (!reported && ctx.scope === 'diff') ctx.report('changed', { path });
    }
  },
);
