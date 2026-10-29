import type { FileSource, TreeEntry } from './types.js';

const MAX_HOPS = 8;

export interface LinkAwareTree {
  entries: TreeEntry[];
  /** Path as seen by rules -> path whose bytes it reads. Only for resolved symlinks. */
  aliases: ReadonlyMap<string, string>;
}

/** Resolves a link target against the link's directory; undefined when it is absolute or leaves the tree. */
function resolveTarget(linkPath: string, target: string): string | undefined {
  if (target === '' || target.startsWith('/') || /^[A-Za-z]:/.test(target) || target.includes('\0')) return undefined;
  const parts = linkPath.split('/').slice(0, -1);
  for (const part of target.replace(/\\/g, '/').split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      if (parts.length === 0) return undefined;
      parts.pop();
    } else {
      parts.push(part);
    }
  }
  return parts.join('/');
}

/**
 * Makes symlinks that point inside the repository look like the files they
 * stand for, so a rule that looks at `.vscode/tasks.json` also sees it when
 * `.vscode` or the file is a link. Links are resolved by this function's own
 * path arithmetic over the tree listing; the operating system never follows
 * one. A link that leaves the tree, dangles, loops or cannot be read stays a
 * `symlink` entry, which the scan reports as "could not check".
 */
export async function resolveLinks(source: FileSource, listed: TreeEntry[]): Promise<LinkAwareTree> {
  const byPath = new Map(listed.map((e) => [e.path, e]));
  const links = listed.filter((e) => e.kind === 'symlink');
  if (links.length === 0 || !source.readLink) return { entries: listed, aliases: new Map() };

  const targets = new Map<string, string | undefined>();
  for (const link of links) targets.set(link.path, await source.readLink(link.path).catch(() => undefined));

  /** Follows a path through links (including links in its parent directories) to a non-link tree path. */
  const follow = (start: string): string | undefined => {
    let current = start;
    for (let hop = 0; hop < MAX_HOPS; hop++) {
      if (!byPath.has(current) || byPath.get(current)!.kind !== 'symlink') {
        // A parent directory may be a link.
        const segments = current.split('/');
        let moved = false;
        for (let i = 1; i < segments.length; i++) {
          const prefix = segments.slice(0, i).join('/');
          if (byPath.get(prefix)?.kind === 'symlink') {
            const resolved = resolveTarget(prefix, targets.get(prefix) ?? '');
            if (resolved === undefined) return undefined;
            current = [resolved, ...segments.slice(i)].filter(Boolean).join('/');
            moved = true;
            break;
          }
        }
        if (!moved) return current;
        continue;
      }
      const resolved = resolveTarget(current, targets.get(current) ?? '');
      if (resolved === undefined) return undefined;
      current = resolved;
    }
    return undefined;
  };

  const entries: TreeEntry[] = [];
  const aliases = new Map<string, string>();
  const real = listed.filter((e) => e.kind !== 'symlink');
  const realPaths = new Set(real.map((e) => e.path));
  entries.push(...real);

  for (const link of links) {
    const resolved = follow(link.path);
    if (resolved !== undefined && realPaths.has(resolved) && byPath.get(resolved)!.kind === 'file') {
      aliases.set(link.path, resolved);
      entries.push({ path: link.path, kind: 'file', size: byPath.get(resolved)!.size });
      continue;
    }
    // A link to a directory: every file below the target shows up below the link.
    const prefix = resolved === undefined ? undefined : `${resolved}/`;
    const below = prefix === undefined ? [] : real.filter((e) => e.path.startsWith(prefix) && e.kind === 'file');
    if (below.length > 0) {
      for (const e of below) {
        const virtual = `${link.path}/${e.path.slice(prefix!.length)}`;
        if (!realPaths.has(virtual)) {
          aliases.set(virtual, e.path);
          entries.push({ path: virtual, kind: 'file', size: e.size });
        }
      }
      continue;
    }
    entries.push(link);
  }
  entries.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  return { entries, aliases };
}
