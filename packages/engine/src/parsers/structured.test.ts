import { describe, expect, it } from 'vitest';
import { parseDevcontainer, parsePackageJson } from './manifests.js';
import { resolveRepoPath } from './text.js';
import { parseTasks, setting, settingsNode } from './vscode.js';
import { parseWorkflow } from './workflow.js';

describe('parseTasks', () => {
  it('reads commands, args, platform overrides and runOn from tasks.json', () => {
    const tasks = parseTasks(
      '.vscode/tasks.json',
      `{
        // comments and trailing commas are allowed
        "version": "2.0.0",
        "tasks": [{
          "label": "x",
          "type": "shell",
          "command": "node",
          "args": ["public/fonts/a.woff2", { "value": "two words", "quoting": "strong" }],
          "windows": { "command": "node.exe" },
          "runOptions": { "runOn": "folderOpen" },
          "presentation": { "reveal": "never" },
        }],
      }`,
    );
    expect(tasks).toHaveLength(1);
    expect(tasks[0]!.commands.map((c) => c.text)).toEqual([
      'node public/fonts/a.woff2 "two words"',
      'node.exe public/fonts/a.woff2 "two words"',
    ]);
    expect(tasks[0]!.folderOpenOffset).toBeDefined();
    expect(tasks[0]!.hiddenOutputOffset).toBeDefined();
  });

  it('includes a custom shell executable in the command line', () => {
    const [task] = parseTasks(
      '.vscode/tasks.json',
      '{"tasks":[{"command":"public/a.ttf","options":{"shell":{"executable":"node"}}}]}',
    );
    expect(task!.commands[0]!.text).toBe('node public/a.ttf');
  });

  it('reads tasks and settings from a .code-workspace file', () => {
    const text = '{"settings":{"task.allowAutomaticTasks":"on"},"tasks":{"tasks":[{"command":"echo DOME_FIXTURE"}]}}';
    expect(parseTasks('x.code-workspace', text)[0]!.commands[0]!.text).toBe('echo DOME_FIXTURE');
    expect(setting(settingsNode('x.code-workspace', text), 'task.allowAutomaticTasks')?.value).toBe('on');
  });

  it('accepts nested setting keys', () => {
    expect(setting(settingsNode('.vscode/settings.json', '{"task":{"allowAutomaticTasks":"on"}}'), 'task.allowAutomaticTasks')?.value).toBe('on');
  });

  it('tolerates malformed input', () => {
    expect(parseTasks('.vscode/tasks.json', '{"tasks": [ {"command": ')).toEqual([
      expect.objectContaining({ commands: [] }),
    ]);
  });
});

describe('manifests', () => {
  it('reads scripts and dependencies from package.json', () => {
    const pkg = parsePackageJson('{"scripts":{"postinstall":"node x.js"},"dependencies":{"a":"1"},"devDependencies":{"b":"2"}}');
    expect(pkg.scripts).toEqual([expect.objectContaining({ name: 'postinstall', text: 'node x.js' })]);
    expect(pkg.dependencies.map((d) => d.name)).toEqual(['a', 'b']);
  });

  it('flattens dev container command forms', () => {
    const cmds = parseDevcontainer(
      '{"postCreateCommand":"npm ci","postStartCommand":["node","a b.js"],"postAttachCommand":{"x":"echo 1","y":["ls"]}}',
    );
    expect(cmds.map((c) => `${c.name}:${c.text}`)).toEqual([
      'postCreateCommand:npm ci',
      'postStartCommand:node "a b.js"',
      'postAttachCommand:echo 1',
      'postAttachCommand:ls',
    ]);
  });
});

describe('parseWorkflow', () => {
  it('reads events and steps', () => {
    const wf = parseWorkflow('on:\n  pull_request_target:\njobs:\n  a:\n    steps:\n      - run: echo hi\n      - uses: actions/checkout@abc\n');
    expect(wf?.events).toEqual(['pull_request_target']);
    expect(wf?.steps).toHaveLength(2);
  });

  it('refuses alias bombs instead of expanding them', () => {
    const bomb = ['a: &a ["x","x","x","x","x","x","x","x","x"]'];
    for (let i = 0; i < 8; i++) bomb.push(`${String.fromCharCode(98 + i)}: &${String.fromCharCode(98 + i)} [*${String.fromCharCode(97 + i)},*${String.fromCharCode(97 + i)},*${String.fromCharCode(97 + i)},*${String.fromCharCode(97 + i)}]`);
    expect(parseWorkflow(bomb.join('\n'))).toBeUndefined();
  });
});

describe('resolveRepoPath', () => {
  it('resolves relative references inside the repository only', () => {
    expect(resolveRepoPath('', './public/fonts/a.woff2')).toBe('public/fonts/a.woff2');
    expect(resolveRepoPath('', '${workspaceFolder}/public/a.ttf')).toBe('public/a.ttf');
    expect(resolveRepoPath('pkg', '../x/y.js')).toBe('x/y.js');
    expect(resolveRepoPath('', 'public\\fonts\\a.woff2')).toBe('public/fonts/a.woff2');
    expect(resolveRepoPath('', '../outside')).toBeUndefined();
    expect(resolveRepoPath('', '/etc/passwd')).toBeUndefined();
  });
});
