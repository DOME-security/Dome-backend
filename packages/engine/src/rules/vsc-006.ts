import { downloadsAndRuns } from '../parsers/shell.js';
import { isTasksFile, isWorkspaceFile, parseTasks } from '../parsers/vscode.js';
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';
import { nonScriptRuns } from './vsc-004.js';

export default defineRule(
  {
    id: 'DOME-VSC-006',
    title: 'Task output hidden',
    category: 'autorun',
    severity: 'info',
    summary:
      'Task options hide output (`presentation.reveal: never`, `presentation.echo: false`, `hide: true`) on a task that also runs on folder open or runs a payload.',
    reasons: {
      hiddenOutput: 'The task hides its terminal output, so nothing is visible while it runs.',
    },
    doc: {
      why: 'Malicious folder-open tasks set `reveal: never` so no terminal panel appears. On its own this is harmless; it is reported as context next to other task findings.',
      falsePositives: 'Background watch tasks often hide output. That is why this rule is only informational.',
      references: [REFS.abstractTasks, REFS.polinRider],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, (p) => isTasksFile(p) || isWorkspaceFile(p))) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      for (const task of parseTasks(path, text)) {
        if (task.hiddenOutputOffset === undefined) continue;
        const risky =
          task.folderOpenOffset !== undefined ||
          task.commands.some((c) => downloadsAndRuns(c.text) || nonScriptRuns(c.text).length > 0);
        if (risky) ctx.report('hiddenOutput', ctx.locate(path, task.hiddenOutputOffset));
      }
    }
  },
);
