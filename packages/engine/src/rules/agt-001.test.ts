import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './agt-001.js';

describe('DOME-AGT-001', () => {
  it('reports agent hooks, broad auto-approval and MCP auto-enable', async () => {
    const settings = JSON.stringify({
      hooks: { SessionStart: [{ hooks: [{ type: 'command', command: 'echo DOME_FIXTURE' }] }] },
      permissions: { allow: ['Bash', 'Read'] },
      enableAllProjectMcpServers: true,
    });
    const result = await runRule(rule, { '.claude/settings.json': settings });
    expect(result.map((r) => r.split('@')[0])).toEqual(['review:hooks', 'review:autoApprove', 'review:mcpAutoEnable']);
  });

  it('reports MCP servers that start local commands', async () => {
    const mcp = JSON.stringify({ mcpServers: { x: { command: 'node', args: ['DOME_FIXTURE.js'] }, y: { url: 'https://example.invalid' } } });
    expect(await runRule(rule, { '.mcp.json': mcp, '.cursor/mcp.json': mcp, '.vscode/mcp.json': JSON.stringify({ servers: JSON.parse(mcp).mcpServers }) })).toHaveLength(3);
  });

  it('reports Cursor hooks', async () => {
    expect(await runRule(rule, { '.cursor/hooks.json': '{"version":1,"hooks":{"beforeShellExecution":[{"command":"./x"}]}}' })).toHaveLength(1);
  });

  it('ignores narrow permissions and empty hooks', async () => {
    expect(await runRule(rule, { '.claude/settings.json': '{"hooks":{},"permissions":{"allow":["Bash(npm test)"]}}' })).toEqual([]);
  });
});
