import { lstat, open, readdir } from 'node:fs/promises';
import path from 'node:path';
import type { FileSource, TreeEntry } from './types.js';

export interface FsSourceOptions {
  /** Directory names that are never descended into. */
  skipDirs?: readonly string[];
}

const DEFAULT_SKIP_DIRS = ['.git', 'node_modules'];

/**
 * Walks a directory on disk. Symlinks are listed but never followed, so a
 * repository cannot point the scanner at files outside itself.
 */
export class FsSource implements FileSource {
  readonly label: string;
  private readonly root: string;
  private readonly skipDirs: ReadonlySet<string>;
  private entries: Map<string, TreeEntry> | undefined;

  constructor(root: string, options: FsSourceOptions = {}) {
    this.root = path.resolve(root);
    this.label = root;
    this.skipDirs = new Set(options.skipDirs ?? DEFAULT_SKIP_DIRS);
  }

  async list(): Promise<TreeEntry[]> {
    if (!this.entries) {
      this.entries = new Map();
      await this.walk('');
    }
    return [...this.entries.values()];
  }

  async read(relPath: string): Promise<Uint8Array | undefined> {
    const entries = this.entries ?? new Map((await this.list()).map((e) => [e.path, e]));
    if (entries.get(relPath)?.kind !== 'file') return undefined;
    const handle = await open(path.join(this.root, ...relPath.split('/')), 'r');
    try {
      return new Uint8Array(await handle.readFile());
    } finally {
      await handle.close();
    }
  }

  private async walk(relDir: string): Promise<void> {
    const absDir = relDir ? path.join(this.root, ...relDir.split('/')) : this.root;
    const dirents = await readdir(absDir, { withFileTypes: true });
    dirents.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    for (const dirent of dirents) {
      const rel = relDir ? `${relDir}/${dirent.name}` : dirent.name;
      if (dirent.isDirectory()) {
        if (!this.skipDirs.has(dirent.name)) await this.walk(rel);
      } else if (dirent.isSymbolicLink()) {
        this.entries!.set(rel, { path: rel, kind: 'symlink', size: 0 });
      } else if (dirent.isFile()) {
        const stats = await lstat(path.join(absDir, dirent.name));
        this.entries!.set(rel, { path: rel, kind: 'file', size: stats.size });
      }
    }
  }
}
