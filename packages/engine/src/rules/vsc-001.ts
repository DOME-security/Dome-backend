import { isTasksFile, isWorkspaceFile, parseTasks } from '../parsers/vscode.js';
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';

export default defineRule(
  {
    id: 'DOME-VSC-001',
    title: 'Task runs on folder open',
    category: 'autorun',
    severity: 'review',
    summary: 'A `.vscode/tasks.json` or `*.code-workspace` task sets `runOptions.runOn` to `folderOpen`.',
    reasons: {
      folderOpen: 'A VS Code task is set to run automatically when the folder is opened.',
    },
    doc: {
      why: 'A folder-open task runs as soon as someone opens the repository in VS Code or Cursor and trusts the workspace. It was the entry point in PolinRider/TasksJacker, Contagious Interview and the RMG-Py incident, where the task launched a script disguised as a font.',
      falsePositives:
        'Watch tasks (`tsc --watch`, `npm run dev`) are sometimes set to start on folder open. Review the command; if it only runs project code, accept it with a hash-pinned `allow` entry.',
      references: [REFS.abstractTasks, REFS.polinRider, REFS.rmgPy, REFS.workspaceTrust],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, (p) => isTasksFile(p) || isWorkspaceFile(p))) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      for (const task of parseTasks(path, text)) {
        if (task.folderOpenOffset !== undefined) ctx.report('folderOpen', ctx.locate(path, task.folderOpenOffset));
      }
    }
  },
);
