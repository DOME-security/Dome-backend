import { downloadsAndRuns } from '../parsers/shell.js';
import { isTasksFile, isWorkspaceFile, parseTasks } from '../parsers/vscode.js';
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';

export default defineRule(
  {
    id: 'DOME-VSC-005',
    title: 'Task downloads and runs code',
    category: 'autorun',
    severity: 'block',
    summary: 'A task command downloads and pipes to a shell (`curl … | sh`, `wget … | bash`, PowerShell `iwr | iex`).',
    reasons: {
      downloadAndRun: 'A VS Code task downloads something from the network and runs it.',
    },
    doc: {
      why: 'Contagious Interview and Microsoft\'s Next.js report describe tasks that fetch a second stage from a staging server and run it in a shell. Nothing about the downloaded code is visible in the repository.',
      falsePositives: 'Setup tasks that install a toolchain with `curl | sh`. Those belong in documentation, not in a task that can run automatically.',
      references: [REFS.abstractTasks, REFS.microsoftNext],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, (p) => isTasksFile(p) || isWorkspaceFile(p))) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      for (const task of parseTasks(path, text)) {
        for (const cmd of task.commands) {
          if (downloadsAndRuns(cmd.text)) ctx.report('downloadAndRun', ctx.locate(path, cmd.offset));
        }
      }
    }
  },
);
