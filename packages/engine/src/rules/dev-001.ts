import { isDevcontainerFile, parseDevcontainer } from '../parsers/manifests.js';
import { downloadsAndRuns } from '../parsers/shell.js';
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';
import { nonScriptRuns } from './vsc-004.js';

const URL_IN_COMMAND = /https?:\/\/[^\s'"|;&)]+/gi;
const PINNED_RAW_URL = /^https:\/\/raw\.githubusercontent\.com\/[\w.-]+\/[\w.-]+\/[0-9a-f]{40}\/[^\s]+$/;

/** Every URL the command fetches is a file at an exact commit, which can never change afterwards. */
function fetchesOnlyPinnedFiles(command: string): boolean {
  const urls = command.match(URL_IN_COMMAND) ?? [];
  return urls.length > 0 && urls.every((u) => PINNED_RAW_URL.test(u));
}

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
      pinnedDownload: 'A dev container command downloads a script pinned to an exact commit and runs it.',
    },
    doc: {
      why: 'Dev container hooks run without a prompt when someone opens the repository in a container or a Codespace. `initializeCommand` is the most sensitive: it runs on the host, with access to the developer\'s keys and wallets.',
      falsePositives:
        'Most dev containers run `npm ci` or similar in `postCreateCommand`. Review the command when it is added or changed. A script downloaded from `raw.githubusercontent.com` at a full commit SHA is reviewed rather than blocked, because it cannot change after review; anyone can pin a commit in their own repository, so check whose it is.',
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
        if (nonScriptRuns(cmd.text).length > 0) ctx.report('payload', location, 'block');
        else if (downloadsAndRuns(cmd.text)) {
          if (fetchesOnlyPinnedFiles(cmd.text)) ctx.report('pinnedDownload', location, 'review');
          else ctx.report('payload', location, 'block');
        } else ctx.report(cmd.name === 'initializeCommand' ? 'hostCommand' : 'lifecycle', location);
      }
    }
  },
);
