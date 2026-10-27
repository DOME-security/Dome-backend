<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# DOME-AGT-001: AI agent hooks or auto-approved tools

| Category | Default level |
|---|---|
| `autorun` | 🟠 review |

AI agent hooks and auto-approved tools: `.claude/settings*.json`, `.cursor/hooks.json`, `.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json`.

## Why it matters

AI coding agents read project-level configuration. Hooks and MCP servers are commands that run when the agent starts or uses a tool, and broad auto-approval lets injected instructions run shell commands unchecked.

## What Dome reports

- Project settings define hooks that an AI coding agent runs automatically.
- Project settings let an AI coding agent run any shell command without asking.
- Project settings enable every MCP server in the repository without asking.
- A project MCP configuration starts a local command when an AI agent loads the repository.

Reasons are fixed text. A finding never quotes the scanned repository.

## False positives

Teams do share formatter hooks and MCP servers. Review what each command runs when the file is added or changed.

Accept a reviewed finding with a hash-pinned entry in `.dome.yml` (`dome scan . --explain` prints one). Editing the file invalidates the exception.

## References

- [VS Code Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust)
