import { findNodeAtLocation, getNodeValue, parseTree, type Node, type ParseError } from 'jsonc-parser';
import { UncheckableInput } from './errors.js';

export type { Node as JsonNode } from 'jsonc-parser';

export interface JsoncDocument {
  root: Node | undefined;
  errors: ParseError[];
}

/** Real configuration files nest a handful of levels; anything deeper is refused. */
export const MAX_NESTING = 256;

/**
 * Deepest `[`/`{` nesting outside strings and comments, in one linear pass.
 * Checked before parsing because the tree builder recurses once per level.
 */
export function nestingDepth(text: string): number {
  let depth = 0;
  let max = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c === 34 /* " */) {
      for (i++; i < text.length && text.charCodeAt(i) !== 34; i++) if (text.charCodeAt(i) === 92 /* \ */) i++;
    } else if (c === 47 /* / */ && text.charCodeAt(i + 1) === 47) {
      while (i < text.length && text.charCodeAt(i) !== 10) i++;
    } else if (c === 47 && text.charCodeAt(i + 1) === 42 /* * */) {
      const end = text.indexOf('*/', i + 2);
      i = end === -1 ? text.length : end + 1;
    } else if (c === 91 /* [ */ || c === 123 /* { */) {
      if (++depth > max) max = depth;
    } else if (c === 93 /* ] */ || c === 125 /* } */) {
      if (depth > 0) depth--;
    }
  }
  return max;
}

/**
 * Parses JSON with comments and trailing commas the way VS Code reads its own
 * settings. The parser is a linear scanner that never evaluates anything;
 * malformed input yields a partial tree plus errors. Input nested deeper
 * than MAX_NESTING throws UncheckableInput.
 */
export function parseJsonc(text: string): JsoncDocument {
  if (nestingDepth(text) > MAX_NESTING) throw new UncheckableInput('JSON nested too deeply');
  const errors: ParseError[] = [];
  const root = parseTree(text, errors, { allowTrailingComma: true, disallowComments: false, allowEmptyContent: true });
  return { root, errors };
}

export function child(node: Node | undefined, key: string | number): Node | undefined {
  if (!node) return undefined;
  return findNodeAtLocation(node, [key]);
}

export function at(node: Node | undefined, ...keys: (string | number)[]): Node | undefined {
  if (!node) return undefined;
  return findNodeAtLocation(node, keys);
}

export function value<T = unknown>(node: Node | undefined): T | undefined {
  if (!node) return undefined;
  return getNodeValue(node) as T;
}

export function stringValue(node: Node | undefined): string | undefined {
  return node?.type === 'string' ? (node.value as string) : undefined;
}

/** Object properties as [key, valueNode, keyNode] triples. */
export function properties(node: Node | undefined): [string, Node, Node][] {
  if (node?.type !== 'object' || !node.children) return [];
  const out: [string, Node, Node][] = [];
  for (const prop of node.children) {
    const [keyNode, valueNode] = prop.children ?? [];
    if (keyNode && valueNode && typeof keyNode.value === 'string') out.push([keyNode.value, valueNode, keyNode]);
  }
  return out;
}

export function elements(node: Node | undefined): Node[] {
  return node?.type === 'array' ? (node.children ?? []) : [];
}
