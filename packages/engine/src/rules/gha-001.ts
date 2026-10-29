import { UncheckableInput } from '../parsers/errors.js';
import { isWorkflowFile, parseWorkflow, type Workflow } from '../parsers/workflow.js';
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';

const SECRET = /\$\{\{\s*secrets\.|toJSON\(\s*secrets\s*\)/i;
const ALL_SECRETS = /toJSON\(\s*secrets\s*\)|\$\{\{\s*secrets\s*\}\}/i;
/** `"${{ secrets.HOOK }}?branch=x"`: the secret is the URL being called, not data sent to one. */
const SECRET_AS_URL = /(?:^|\s)["']?\$\{\{\s*secrets\.\w+\s*\}\}[?/]\S*/g;
const HTTPS_HOST_URL = /\bhttps:\/\/(?![\d.]+(?:[:/\s"']|$))[A-Za-z0-9]/;
const NETWORK_TOOL = /\b(?:curl|wget|Invoke-WebRequest|Invoke-RestMethod|iwr|irm|nc|ncat)\b/i;
const RAW_IP_URL = /\bhttps?:\/\/(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?![\w-]|\.\w)/g;

/** Loopback, private and link-local addresses never leave the runner's network. */
function isLocalAddress([a, b]: number[]): boolean {
  return a === 127 || a === 10 || a === 0 || (a === 172 && b! >= 16 && b! <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254);
}

/** The first URL with a public raw IP address, if any. */
function publicIpUrl(run: string): RegExpMatchArray | undefined {
  for (const m of run.matchAll(RAW_IP_URL)) {
    const octets = m.slice(1, 5).map(Number);
    if (octets.every((o) => o <= 255) && !isLocalAddress(octets)) return m;
  }
  return undefined;
}
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
        'Every honest workflow change is reported for review in a diff scan. One named secret sent over HTTPS to a named host (an API token for a deployment) is reviewed, not blocked; bulk secret dumps, plain HTTP and raw public IP addresses are blocked. Loopback and private addresses (`127.0.0.1`, `10.x`, `172.16-31.x`, `192.168.x`) are ignored.',
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
        const ipUrl = publicIpUrl(step.run);
        if (SECRET.test(step.run) && NETWORK_TOOL.test(step.run)) {
          // One named secret sent over HTTPS to a named host is how deployments
          // authenticate; every other shape of this is how secrets are stolen.
          const withoutUrlSecrets = step.run.replace(SECRET_AS_URL, ' ');
          const namesHost = HTTPS_HOST_URL.test(step.run) || withoutUrlSecrets !== step.run;
          const routine = !ALL_SECRETS.test(step.run) && namesHost && !ipUrl && !/\bhttp:\/\//i.test(step.run);
          ctx.report('secretsToNetwork', loc(firstLine), routine ? 'review' : 'block');
          reported = true;
        }
        if (ipUrl) {
          ctx.report('rawIp', loc(ipUrl[0]), 'block');
          reported = true;
        }
      }
      if (!reported && ctx.scope === 'diff') ctx.report('changed', { path });
    }
  },
);
