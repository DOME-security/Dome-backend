import { basename } from './text.js';
import { child, parseJsonc, properties, stringValue, type JsonNode } from './jsonc.js';

export interface NamedCommand {
  name: string;
  text: string;
  offset: number;
}

export function isPackageJson(p: string): boolean {
  return basename(p) === 'package.json';
}

export interface PackageManifest {
  root: JsonNode | undefined;
  scripts: NamedCommand[];
  /** Dependency names across all dependency fields, with the offset of each key. */
  dependencies: { name: string; offset: number }[];
}

const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies', 'bundleDependencies'];

export function parsePackageJson(text: string): PackageManifest {
  const { root } = parseJsonc(text);
  const scripts: NamedCommand[] = [];
  for (const [name, node] of properties(child(root, 'scripts'))) {
    const script = stringValue(node);
    if (script !== undefined) scripts.push({ name, text: script, offset: node.offset });
  }
  const dependencies: { name: string; offset: number }[] = [];
  for (const field of DEPENDENCY_FIELDS) {
    for (const [name, , keyNode] of properties(child(root, field))) dependencies.push({ name, offset: keyNode.offset });
  }
  return { root, scripts, dependencies };
}

/** Scripts npm, pnpm and yarn run automatically on install. */
export const INSTALL_SCRIPTS = new Set(['preinstall', 'install', 'postinstall', 'prepare', 'preprepare', 'postprepare', 'prepublish']);

export function isDevcontainerFile(p: string): boolean {
  return (
    p === '.devcontainer.json' ||
    p === '.devcontainer/devcontainer.json' ||
    /^\.devcontainer\/[^/]+\/devcontainer\.json$/.test(p)
  );
}

export const DEVCONTAINER_COMMANDS = [
  'initializeCommand',
  'onCreateCommand',
  'updateContentCommand',
  'postCreateCommand',
  'postStartCommand',
  'postAttachCommand',
];

/**
 * Lifecycle commands from a dev container definition. A command may be a
 * string, an array of arguments, or an object of named parallel commands.
 */
export function parseDevcontainer(text: string): NamedCommand[] {
  const { root } = parseJsonc(text);
  const out: NamedCommand[] = [];
  for (const name of DEVCONTAINER_COMMANDS) {
    const node = child(root, name);
    if (!node) continue;
    for (const cmd of flattenCommand(node)) out.push({ name, text: cmd.text, offset: cmd.offset });
  }
  return out;
}

function flattenCommand(node: JsonNode): { text: string; offset: number }[] {
  if (node.type === 'string') return [{ text: node.value as string, offset: node.offset }];
  if (node.type === 'array') {
    const parts = (node.children ?? []).map((c) => stringValue(c) ?? '');
    return [{ text: parts.map((p) => (/\s/.test(p) ? `"${p}"` : p)).join(' '), offset: node.offset }];
  }
  if (node.type === 'object') return properties(node).flatMap(([, v]) => flattenCommand(v));
  return [];
}
