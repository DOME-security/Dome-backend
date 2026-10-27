import { at, child, elements, parseJsonc, properties, stringValue, value, type JsonNode } from './jsonc.js';

export interface TaskCommand {
  /** The command line as VS Code would hand it to a shell or process. */
  text: string;
  /** Offset of the `command` value (or the task) in the file. */
  offset: number;
}

export interface VsTask {
  offset: number;
  type: string | undefined;
  /** Offset of `runOn: "folderOpen"`, when present. */
  folderOpenOffset: number | undefined;
  /** Offset of a presentation option that hides the task's output, when present. */
  hiddenOutputOffset: number | undefined;
  /** For `type: "npm"` tasks, the package.json script the task runs. */
  npmScript: string | undefined;
  commands: TaskCommand[];
}

function joinCommandValue(node: JsonNode | undefined): string | undefined {
  if (!node) return undefined;
  if (node.type === 'string') return node.value as string;
  if (node.type === 'array') return elements(node).map((e) => quoteArg(stringValue(e) ?? '')).join(' ');
  if (node.type === 'object') return joinCommandValue(child(node, 'value'));
  return undefined;
}

function quoteArg(arg: string): string {
  return /[\s"']/.test(arg) ? `"${arg.replace(/(["\\$`])/g, '\\$1')}"` : arg;
}

function argsOf(node: JsonNode | undefined): string[] {
  return elements(node).map((e) => {
    if (e.type === 'string') return quoteArg(e.value as string);
    if (e.type === 'object') return quoteArg(joinCommandValue(child(e, 'value')) ?? '');
    return '';
  });
}

/** Builds the effective command line for a task or a platform override of it. */
function commandFor(scope: JsonNode, fallback: JsonNode | undefined): TaskCommand | undefined {
  const commandNode = child(scope, 'command') ?? (fallback && child(fallback, 'command'));
  const command = joinCommandValue(commandNode);
  if (command === undefined) return undefined;
  const argsNode = child(scope, 'args') ?? (fallback && child(fallback, 'args'));
  const parts = [command, ...argsOf(argsNode)];
  const shell = at(scope, 'options', 'shell') ?? (fallback && at(fallback, 'options', 'shell'));
  const executable = stringValue(child(shell, 'executable'));
  if (executable) parts.unshift(quoteArg(executable), ...argsOf(child(shell, 'args')));
  return { text: parts.join(' '), offset: (commandNode ?? scope).offset };
}

function hiddenOutputOffset(task: JsonNode): number | undefined {
  const reveal = at(task, 'presentation', 'reveal');
  if (stringValue(reveal) === 'never') return reveal!.offset;
  const echo = at(task, 'presentation', 'echo');
  if (echo?.type === 'boolean' && echo.value === false) return echo.offset;
  const hide = child(task, 'hide');
  if (hide?.type === 'boolean' && hide.value === true) return hide.offset;
  return undefined;
}

function tasksFrom(container: JsonNode | undefined): VsTask[] {
  const tasks: VsTask[] = [];
  for (const task of elements(child(container, 'tasks'))) {
    if (task.type !== 'object') continue;
    const runOn = at(task, 'runOptions', 'runOn');
    const commands: TaskCommand[] = [];
    const base = commandFor(task, undefined);
    if (base) commands.push(base);
    for (const platform of ['windows', 'linux', 'osx']) {
      const override = child(task, platform);
      if (override?.type !== 'object') continue;
      const cmd = commandFor(override, task);
      if (cmd) commands.push(cmd);
    }
    const type = stringValue(child(task, 'type'));
    tasks.push({
      offset: task.offset,
      type,
      folderOpenOffset: stringValue(runOn) === 'folderOpen' ? runOn!.offset : undefined,
      hiddenOutputOffset: hiddenOutputOffset(task),
      npmScript: type === 'npm' ? stringValue(child(task, 'script')) : undefined,
      commands,
    });
  }
  return tasks;
}

export function isTasksFile(p: string): boolean {
  return p === '.vscode/tasks.json' || p.endsWith('/.vscode/tasks.json');
}

export function isWorkspaceFile(p: string): boolean {
  return p.endsWith('.code-workspace');
}

export function isSettingsFile(p: string): boolean {
  return p === '.vscode/settings.json' || p.endsWith('/.vscode/settings.json');
}

/** Tasks from a `.vscode/tasks.json` or a `*.code-workspace` file. */
export function parseTasks(path: string, text: string): VsTask[] {
  const { root } = parseJsonc(text);
  return tasksFrom(isWorkspaceFile(path) ? child(root, 'tasks') : root);
}

/** The settings object from `.vscode/settings.json` or a `*.code-workspace` file. */
export function settingsNode(path: string, text: string): JsonNode | undefined {
  const { root } = parseJsonc(text);
  return isWorkspaceFile(path) ? child(root, 'settings') : root;
}

/** Looks up a setting, accepting both flat (`"task.allowAutomaticTasks"`) and nested keys. */
export function setting(settings: JsonNode | undefined, key: string): JsonNode | undefined {
  for (const [k, v] of properties(settings)) if (k === key) return v;
  const [head, ...rest] = key.split('.');
  if (!head || rest.length === 0) return undefined;
  for (const [k, v] of properties(settings)) if (k === head) return setting(v, rest.join('.'));
  return undefined;
}

export { value as jsonValue };
