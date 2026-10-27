import type { FileSource, TreeEntry } from './types.js';

/** An in-memory tree. Used by tests and by callers that already hold file contents. */
export class MemorySource implements FileSource {
  private readonly files: Map<string, Uint8Array>;

  constructor(
    files: Record<string, string | Uint8Array>,
    readonly label = 'memory',
    private readonly symlinks: readonly string[] = [],
  ) {
    const encoder = new TextEncoder();
    this.files = new Map(Object.entries(files).map(([p, c]) => [p, typeof c === 'string' ? encoder.encode(c) : c]));
  }

  async list(): Promise<TreeEntry[]> {
    const entries: TreeEntry[] = [...this.files].map(([path, bytes]) => ({ path, kind: 'file', size: bytes.length }));
    for (const path of this.symlinks) entries.push({ path, kind: 'symlink', size: 0 });
    return entries.sort((a, b) => a.path.localeCompare(b.path));
  }

  async read(path: string): Promise<Uint8Array | undefined> {
    return this.files.get(path);
  }
}
