import { at, child, elements, parseJsonc, properties, stringValue, type JsonNode } from '../parsers/jsonc.js';
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';

const CLAUDE_SETTINGS = /(?:^|\/)\.claude\/settings(?:\.local)?\.json$/;
const CURSOR_HOOKS = /(?:^|\/)\.cursor\/hooks\.json$/;
const MCP_CONFIG = /(?:^|\/)(?:\.mcp\.json|\.cursor\/mcp\.json|\.vscode\/mcp\.json)$/;

function hasEntries(node: JsonNode | undefined): boolean {
  if (!node) return false;
  if (node.type === 'object' || node.type === 'array') return (node.children?.length ?? 0) > 0;
  return false;
}

const BROAD_ALLOW = /^(?:Bash|Bash\(\*?\)|Bash\(\*:\*\)|\*)$/;

export default defineRule(
  {
    id: 'DOME-AGT-001',
    title: 'AI agent hooks or auto-approved tools',
    category: 'autorun',
    severity: 'review',
    summary:
      'AI agent hooks and auto-approved tools: `.claude/settings*.json`, `.cursor/hooks.json`, `.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json`.',
    reasons: {
      hooks: 'Project settings define hooks that an AI coding agent runs automatically.',
      autoApprove: 'Project settings let an AI coding agent run any shell command without asking.',
      mcpAutoEnable: 'Project settings enable every MCP server in the repository without asking.',
      mcpServer: 'A project MCP configuration starts a local command when an AI agent loads the repository.',
    },
    doc: {
      why: 'AI coding agents read project-level configuration. Hooks and MCP servers are commands that run when the agent starts or uses a tool, and broad auto-approval lets injected instructions run shell commands unchecked.',
      falsePositives: 'Teams do share formatter hooks and MCP servers. Review what each command runs when the file is added or changed.',
      references: [REFS.workspaceTrust],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, (p) => CLAUDE_SETTINGS.test(p) || CURSOR_HOOKS.test(p) || MCP_CONFIG.test(p))) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      const { root } = parseJsonc(text);
      if (CLAUDE_SETTINGS.test(path) || CURSOR_HOOKS.test(path)) {
        const hooks = child(root, 'hooks');
        if (hasEntries(hooks)) ctx.report('hooks', ctx.locate(path, hooks!.offset));
      }
      if (CLAUDE_SETTINGS.test(path)) {
        for (const entry of elements(at(root, 'permissions', 'allow'))) {
          if (BROAD_ALLOW.test(stringValue(entry) ?? '')) ctx.report('autoApprove', ctx.locate(path, entry.offset));
        }
        const all = child(root, 'enableAllProjectMcpServers');
        if (all?.value === true) ctx.report('mcpAutoEnable', ctx.locate(path, all.offset));
      }
      if (MCP_CONFIG.test(path)) {
        for (const key of ['mcpServers', 'servers']) {
          for (const [, server] of properties(child(root, key))) {
            const command = child(server, 'command');
            if (stringValue(command)) ctx.report('mcpServer', ctx.locate(path, command!.offset));
          }
        }
      }
    }
  },
);
