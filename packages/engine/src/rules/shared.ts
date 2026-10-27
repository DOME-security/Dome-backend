import { isDevcontainerFile, isPackageJson, parseDevcontainer, parsePackageJson } from '../parsers/manifests.js';
import { dirname, extname, isJsConfigFile, isMinifiedName, isRouteFile } from '../parsers/text.js';
import { isTasksFile, isWorkspaceFile, parseTasks } from '../parsers/vscode.js';
import { isWorkflowFile, parseWorkflow } from '../parsers/workflow.js';
import type { Location, Reference } from '../types.js';
import type { RuleContext } from './rule.js';

export const REFS = {
  polinRider: { title: 'OpenSourceMalware: PolinRider dossier and YARA rule', url: 'https://github.com/OpenSourceMalware/PolinRider' },
  microsoftNext: {
    title: 'Microsoft: Developer-targeting campaign using malicious Next.js repositories',
    url: 'https://www.microsoft.com/en-us/security/blog/2026/02/24/c2-developer-targeting-campaign/',
  },
  abstractTasks: {
    title: 'Abstract Security: Tracking the VS Code tasks infection vector',
    url: 'https://www.abstract.security/blog/contagious-interview-tracking-the-vs-code-tasks-infection-vector',
  },
  rmgPy: { title: 'RMG-Py incident report and hardening advice', url: 'https://github.com/ReactionMechanismGenerator/RMG-Py/issues/3008' },
  ghostAction: { title: 'Socket: GhostAction workflow injection', url: 'https://socket.dev/blog/ghostaction-cloud-credentials' },
  workspaceTrust: { title: 'VS Code Workspace Trust', url: 'https://code.visualstudio.com/docs/editing/workspaces/workspace-trust' },
  actionsHardening: {
    title: 'GitHub Actions security hardening',
    url: 'https://docs.github.com/actions/security-guides/security-hardening-for-github-actions',
  },
  npmScripts: { title: 'npm scripts and lifecycle events', url: 'https://docs.npmjs.com/cli/v10/using-npm/scripts' },
  devcontainerJson: { title: 'Dev Container metadata reference', url: 'https://containers.dev/implementors/json_reference/' },
  stellarCliKeys: {
    title: 'Stellar CLI key storage',
    url: 'https://developers.stellar.org/docs/tools/cli/agent-cli/reference/architecture',
  },
  strkey: { title: 'SEP-23: Strkey encoding', url: 'https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0023.md' },
  stellarLight: { title: 'Stellar Light repo-security holds', url: 'https://github.com/Stellar-Light/stellarlight/pull/1833' },
} satisfies Record<string, Reference>;

export type CommandOrigin = 'task' | 'npm' | 'devcontainer' | 'workflow' | 'shell';

export interface ExecutableCommand {
  origin: CommandOrigin;
  path: string;
  /** Directory that relative paths in the command resolve against. */
  dir: string;
  text: string;
  offset: number;
  /** For npm scripts and dev container hooks, the script or hook name. */
  name?: string;
}

const SHELL_SCRIPT_EXTENSIONS = new Set(['sh', 'bash', 'zsh', 'bat', 'cmd', 'ps1', 'command']);

export function isShellScript(p: string): boolean {
  return SHELL_SCRIPT_EXTENSIONS.has(extname(p));
}

/** The folder a `.vscode/tasks.json` belongs to. */
export function workspaceRootOf(p: string): string {
  return isWorkspaceFile(p) ? dirname(p) : dirname(dirname(p));
}

/**
 * Every command line in an execution position among the scan's targets:
 * VS Code tasks, npm scripts, dev container hooks, workflow `run` steps and
 * shell scripts.
 */
export async function executableCommands(
  ctx: RuleContext,
  origins: ReadonlySet<CommandOrigin>,
  npmFilter: (name: string) => boolean = () => true,
): Promise<ExecutableCommand[]> {
  const out: ExecutableCommand[] = [];
  for (const entry of ctx.targets) {
    if (entry.kind === 'submodule') continue;
    const p = entry.path;
    if (origins.has('task') && (isTasksFile(p) || isWorkspaceFile(p))) {
      const text = await ctx.readText(p);
      if (text === undefined) continue;
      const dir = workspaceRootOf(p);
      for (const task of parseTasks(p, text)) {
        for (const cmd of task.commands) out.push({ origin: 'task', path: p, dir, text: cmd.text, offset: cmd.offset });
      }
    } else if (origins.has('npm') && isPackageJson(p)) {
      const text = await ctx.readText(p);
      if (text === undefined) continue;
      for (const s of parsePackageJson(text).scripts) {
        if (npmFilter(s.name)) out.push({ origin: 'npm', path: p, dir: dirname(p), text: s.text, offset: s.offset, name: s.name });
      }
    } else if (origins.has('devcontainer') && isDevcontainerFile(p)) {
      const text = await ctx.readText(p);
      if (text === undefined) continue;
      for (const c of parseDevcontainer(text)) {
        out.push({ origin: 'devcontainer', path: p, dir: '', text: c.text, offset: c.offset, name: c.name });
      }
    } else if (origins.has('workflow') && isWorkflowFile(p)) {
      const text = await ctx.readText(p);
      const wf = text === undefined ? undefined : parseWorkflow(text);
      if (!wf || text === undefined) continue;
      for (const step of wf.steps) {
        if (step.run === undefined) continue;
        const firstLine = step.run.split('\n', 1)[0]!.trim();
        const offset = firstLine ? Math.max(0, text.indexOf(firstLine)) : 0;
        out.push({ origin: 'workflow', path: p, dir: '', text: step.run, offset });
      }
    } else if (origins.has('shell') && isShellScript(p)) {
      const text = await ctx.readText(p);
      if (text !== undefined) out.push({ origin: 'shell', path: p, dir: dirname(p), text, offset: 0 });
    }
  }
  return out;
}

/** Location of `needle` inside a command, falling back to the command itself. */
export function locateInCommand(ctx: RuleContext, cmd: ExecutableCommand, needle: string, fileText?: string): Location {
  if (fileText !== undefined) {
    const at = fileText.indexOf(needle, cmd.offset);
    if (at !== -1) return ctx.locate(cmd.path, at);
  }
  return ctx.locate(cmd.path, cmd.offset);
}

/** JS/TS files that run with the developer's privileges when the project builds or starts. */
export function isServerSideCode(p: string): boolean {
  return isJsConfigFile(p) || isRouteFile(p);
}

export function looksBinary(bytes: Uint8Array): boolean {
  const end = Math.min(bytes.length, 8000);
  for (let i = 0; i < end; i++) if (bytes[i] === 0) return true;
  return false;
}

const VENDORED = /(?:^|\/)(?:node_modules|\.yarn|vendor|third_party|bower_components|dist|build|out|\.next|coverage)\//;

/** Dependency copies, release binaries and build output: not code a contributor wrote in this change. */
export function isVendored(p: string): boolean {
  return VENDORED.test(p) || isMinifiedName(p);
}

const TEST_PATH = /(?:^|\/)(?:test|tests|__tests__|spec|__mocks__)\/|\.(?:test|spec)\.[cm]?[jt]sx?$/;

export function isTestPath(p: string): boolean {
  return TEST_PATH.test(p);
}
