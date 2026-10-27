import { isDevcontainerFile, parseDevcontainer } from '../parsers/manifests.js';
import { downloadsAndRuns } from '../parsers/shell.js';
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';
import { nonScriptRuns } from './vsc-004.js';

export default defineRule(
  {
    id: 'DOME-DEV-001',
    title: 'Dev container lifecycle command',
    category: 'autorun',
    severity: 'review',
    summary:
      '`.devcontainer/devcontainer.json` `initializeCommand`, `onCreateCommand`, `postCreateCommand`, `postStartCommand` or `postAttachCommand` added or changed.',
    reasons: {
      hostCommand: 'The initializeCommand hook runs on the host machine, outside the container, before the container starts.',
      lifecycle: 'A dev container command runs automatically when the container is created, started or attached.',
      payload: 'A dev container command downloads and runs code, or runs a file that is not a script with Node.',
    },
    doc: {
      why: 'Dev container hooks run without a prompt when someone opens the repository in a container or a Codespace. `initializeCommand` is the most sensitive: it runs on the host, with access to the developer\'s keys and wallets.',
      falsePositives: 'Most dev containers run `npm ci` or similar in `postCreateCommand`. Review the command when it is added or changed.',
      references: [REFS.devcontainerJson, REFS.microsoftNext],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, isDevcontainerFile)) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      const before = new Set(parseDevcontainer((await ctx.readBaseText(path)) ?? '{}').map((c) => `${c.name}\0${c.text}`));
      for (const cmd of parseDevcontainer(text)) {
        if (ctx.scope === 'diff' && before.has(`${cmd.name}\0${cmd.text}`)) continue;
        const location = ctx.locate(path, cmd.offset);
        if (downloadsAndRuns(cmd.text) || nonScriptRuns(cmd.text).length > 0) ctx.report('payload', location, 'block');
        else ctx.report(cmd.name === 'initializeCommand' ? 'hostCommand' : 'lifecycle', location);
      }
    }
  },
);
