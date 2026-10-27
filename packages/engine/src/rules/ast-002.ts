import { findCodeConstruction, stringCalls, tokenize } from '../parsers/js.js';
import { isAssetPath, isJsLike } from '../parsers/text.js';
import { defineRule, targetsWhere } from './rule.js';
import { executableCommands, isTestPath, locateInCommand, REFS } from './shared.js';
import { nonScriptRuns } from './vsc-004.js';

const SPAWNERS = new Set(['fork']);
const READERS = new Set(['readFileSync', 'readFile']);

export default defineRule(
  {
    id: 'DOME-AST-002',
    title: 'Asset in an execution position',
    category: 'payload',
    severity: 'block',
    summary:
      'An image or font asset referenced from an execution position (npm script, dev container hook, workflow step, shell script, `fork`, or read and evaluated).',
    reasons: {
      command: 'A script or hook runs an image, font or other non-script file with Node.',
      fork: 'Code starts a new Node process from an image or font file.',
      evaluated: 'Code reads an image or font file and builds code from it at runtime.',
    },
    doc: {
      why: 'Assets are never code. When something hands an asset to Node, or reads one and passes it to `eval`, `new Function` or `vm`, the asset is a disguised payload. VS Code tasks are covered by DOME-VSC-004.',
      falsePositives: 'None known.',
      references: [REFS.polinRider, REFS.microsoftNext],
    },
  },
  async (ctx) => {
    const commands = await executableCommands(ctx, new Set(['npm', 'devcontainer', 'workflow', 'shell']));
    for (const cmd of commands) {
      const fileText = await ctx.readText(cmd.path);
      for (const file of nonScriptRuns(cmd.text)) ctx.report('command', locateInCommand(ctx, cmd, file, fileText));
    }
    for (const { path } of targetsWhere(ctx, (p) => isJsLike(p) && !isTestPath(p) && !p.includes('node_modules/'))) {
      const text = await ctx.readText(path);
      if (text === undefined || !/fork|readFile/.test(text)) continue;
      const tokens = tokenize(text);
      for (const call of stringCalls(tokens, SPAWNERS)) {
        if (isAssetPath(call.arg)) ctx.report('fork', ctx.locate(path, call.offset));
      }
      const reads = stringCalls(tokens, READERS).filter((c) => isAssetPath(c.arg));
      if (reads.length > 0 && findCodeConstruction(tokens).some((c) => c.kind !== 'hiddenSpawn')) {
        ctx.report('evaluated', ctx.locate(path, reads[0]!.offset));
      }
    }
  },
);
