import { findNodeAtLocation, getNodeValue, parseTree, type Node, type ParseError } from 'jsonc-parser';

export type { Node as JsonNode } from 'jsonc-parser';

export interface JsoncDocument {
  root: Node | undefined;
  errors: ParseError[];
}

/**
 * Parses JSON with comments and trailing commas the way VS Code reads its own
 * settings. The parser is a linear scanner that never throws and never
 * evaluates anything; malformed input yields a partial tree plus errors.
 */
export function parseJsonc(text: string): JsoncDocument {
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
