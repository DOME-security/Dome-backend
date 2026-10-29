import type { FileSource, TreeEntry } from './types.js';

/** An in-memory tree. Used by tests and by callers that already hold file contents. */
export class MemorySource implements FileSource {
  private readonly files: Map<string, Uint8Array>;
  private readonly links: Map<string, string | undefined>;

  constructor(
    files: Record<string, string | Uint8Array>,
    readonly label = 'memory',
    symlinks: readonly string[] | Readonly<Record<string, string>> = [],
  ) {
    this.links = new Map(Array.isArray(symlinks) ? symlinks.map((p) => [p, undefined]) : Object.entries(symlinks));
    const encoder = new TextEncoder();
    this.files = new Map(Object.entries(files).map(([p, c]) => [p, typeof c === 'string' ? encoder.encode(c) : c]));
  }

  async list(): Promise<TreeEntry[]> {
    const entries: TreeEntry[] = [...this.files].map(([path, bytes]) => ({ path, kind: 'file', size: bytes.length }));
    for (const path of this.links.keys()) entries.push({ path, kind: 'symlink', size: 0 });
    return entries.sort((a, b) => a.path.localeCompare(b.path));
  }

  async read(path: string): Promise<Uint8Array | undefined> {
    return this.files.get(path);
  }

  async readLink(path: string): Promise<string | undefined> {
    return this.links.get(path);
  }
}

