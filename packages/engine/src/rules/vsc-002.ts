import { isSettingsFile, isWorkspaceFile, setting, settingsNode } from '../parsers/vscode.js';
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';

export default defineRule(
  {
    id: 'DOME-VSC-002',
    title: 'Automatic tasks turned on',
    category: 'autorun',
    severity: 'review',
    summary: 'Workspace settings set `task.allowAutomaticTasks` to `on`.',
    reasons: {
      allowAutomaticTasks: 'Turns on automatic tasks so VS Code does not ask first.',
    },
    doc: {
      why: 'VS Code asks before running a folder-open task for the first time. Setting `task.allowAutomaticTasks` to `on` in the workspace removes that prompt, which is what the RMG-Py attacker did alongside the malicious task.',
      falsePositives:
        'Rare. A project that wants its watch task to start silently might set it, but that choice belongs in each developer\'s user settings, not in the repository.',
      references: [REFS.rmgPy, REFS.workspaceTrust],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, (p) => isSettingsFile(p) || isWorkspaceFile(p))) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      const node = setting(settingsNode(path, text), 'task.allowAutomaticTasks');
      if (node && (node.value === 'on' || node.value === true)) ctx.report('allowAutomaticTasks', ctx.locate(path, node.offset));
    }
  },
);
