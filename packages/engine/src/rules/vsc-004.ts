import { parsePackageJson } from '../parsers/manifests.js';
import { nodeInvocations } from '../parsers/shell.js';
import { isAssetPath, isNonScriptForNode, resolveRepoPath } from '../parsers/text.js';
import { isTasksFile, isWorkspaceFile, parseTasks } from '../parsers/vscode.js';
import { stringCalls, tokenize } from '../parsers/js.js';
import { defineRule, targetsWhere, type RuleContext } from './rule.js';
import { REFS, workspaceRootOf } from './shared.js';

const LOADERS = new Set(['require', 'import', 'readFileSync', 'readFile']);

/** Files a command line makes Node execute that are not scripts. */
export function nonScriptRuns(commandText: string): string[] {
  const { runs, inline } = nodeInvocations(commandText);
  const files = runs.filter((r) => isNonScriptForNode(r.file)).map((r) => r.file);
  for (const code of inline) {
    for (const call of stringCalls(tokenize(code), LOADERS)) if (isAssetPath(call.arg)) files.push(call.arg);
  }
  return files;
}

async function npmScriptText(ctx: RuleContext, root: string, script: string): Promise<string | undefined> {
  const pkgPath = root ? `${root}/package.json` : 'package.json';
  const text = await ctx.readText(pkgPath);
  if (text === undefined) return undefined;
  return parsePackageJson(text).scripts.find((s) => s.name === script)?.text;
}

export default defineRule(
  {
    id: 'DOME-VSC-004',
    title: 'Task runs a non-script file with Node',
    category: 'autorun',
    severity: 'block',
    summary:
      'A task command runs a font, image or other non-script file with `node` (string or array form, `sh -c`, `-r`/`--import`, stdin).',
    reasons: {
      nonScript: 'A VS Code task runs a file that is not a script (such as a font or image) with Node.',
      nonScriptViaNpm: 'A VS Code task runs an npm script that runs a file that is not a script with Node.',
    },
    doc: {
      why: 'Legitimate tasks run JavaScript files. Running `node` on a `.woff2`, `.png` or similar is how PolinRider, GhostAction and the RMG-Py attacker hid their loader: the "font" is really obfuscated JavaScript.',
      falsePositives: 'None known. Node has no reason to execute an asset file.',
      references: [REFS.polinRider, REFS.rmgPy, REFS.abstractTasks],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, (p) => isTasksFile(p) || isWorkspaceFile(p))) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      const root = workspaceRootOf(path);
      for (const task of parseTasks(path, text)) {
        for (const cmd of task.commands) {
          for (const file of nonScriptRuns(cmd.text)) {
            const at = text.indexOf(file.replace(/\\/g, '\\\\'), cmd.offset);
            ctx.report('nonScript', [
              ctx.locate(path, at === -1 ? cmd.offset : at),
              ...referenced(ctx, root, file),
            ]);
          }
        }
        if (task.npmScript) {
          const script = await npmScriptText(ctx, root, task.npmScript);
          if (script && nonScriptRuns(script).length > 0) ctx.report('nonScriptViaNpm', ctx.locate(path, task.offset));
        }
      }
    }
  },
);

function referenced(ctx: RuleContext, root: string, file: string) {
  const resolved = resolveRepoPath(root, file);
  return resolved && ctx.tree.has(resolved) ? [{ path: resolved }] : [];
}
