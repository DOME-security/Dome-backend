export type EntryKind = 'file' | 'symlink' | 'submodule';

export interface TreeEntry {
  /** Repository-relative POSIX path. */
  path: string;
  kind: EntryKind;
  /** Size in bytes, when known. */
  size: number;
}

/**
 * A read-only view of a repository tree. Implementations read bytes; none of
 * them run anything from the repository.
 */
export interface FileSource {
  /** A human-readable label for reports (a path or URL). */
  readonly label: string;
  list(): Promise<TreeEntry[]>;
  /** Returns the file's bytes, or `undefined` if it is not a regular file in the tree. */
  read(path: string): Promise<Uint8Array | undefined>;
  close?(): Promise<void>;
}
