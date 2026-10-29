import { gunzipSync } from 'node:zlib';
import type { FileSource, TreeEntry } from './types.js';

const BLOCK = 512;
const MAX_LINK_BYTES = 4096;

export class TarError extends Error {
  override name = 'TarError';
}

interface Member {
  entry: TreeEntry;
  data?: Uint8Array;
  link?: string;
}

const decoder = new TextDecoder();

function cString(bytes: Uint8Array): string {
  const end = bytes.indexOf(0);
  return decoder.decode(end === -1 ? bytes : bytes.subarray(0, end));
}

function octal(bytes: Uint8Array): number {
  const text = cString(bytes).trim();
  if (text === '') return 0;
  if (!/^[0-7]+$/.test(text)) throw new TarError('invalid size field');
  return Number.parseInt(text, 8);
}

/** `<len> <key>=<value>\n` records of a pax extended header. */
function paxRecords(data: Uint8Array): Map<string, string> {
  const out = new Map<string, string>();
  let at = 0;
  while (at < data.length) {
    const space = data.indexOf(0x20, at);
    if (space === -1) break;
    const len = Number(decoder.decode(data.subarray(at, space)));
    if (!Number.isInteger(len) || len <= space - at || at + len > data.length) break;
    const record = decoder.decode(data.subarray(space + 1, at + len - 1));
    const eq = record.indexOf('=');
    if (eq > 0) out.set(record.slice(0, eq), record.slice(eq + 1));
    at += len;
  }
  return out;
}

/** Drops the archive's single top-level folder and rejects anything that could leave the tree. */
function repoPath(name: string): string | undefined {
  const parts = name.split('/').filter((p) => p !== '' && p !== '.');
  parts.shift();
  if (parts.length === 0 || parts.some((p) => p === '..' || p.includes('\0'))) return undefined;
  return parts.join('/');
}

/**
 * A repository snapshot held in memory from an uncompressed tar archive (what
 * `GET /repos/{owner}/{repo}/tarball` returns, once gunzipped). Nothing is
 * written to disk, so a hostile archive cannot place a file anywhere, and
 * nothing in it is executed.
 */
export class TarSource implements FileSource {
  private readonly members = new Map<string, Member>();
  /** The commit named by the archive's global pax header, when present. */
  readonly commit: string | undefined;

  constructor(
    tar: Uint8Array,
    readonly label = 'tarball',
  ) {
    let at = 0;
    let commit: string | undefined;
    let pending: { path?: string; linkpath?: string } = {};
    while (at + BLOCK <= tar.length) {
      const header = tar.subarray(at, at + BLOCK);
      if (header.every((b) => b === 0)) break;
      const size = octal(header.subarray(124, 136));
      const type = String.fromCharCode(header[156] || 0x30);
      const start = at + BLOCK;
      if (start + size > tar.length) throw new TarError('archive is truncated');
      const data = tar.subarray(start, start + size);
      at = start + Math.ceil(size / BLOCK) * BLOCK;

      if (type === 'g') {
        commit ??= paxRecords(data).get('comment');
        continue;
      }
      if (type === 'x') {
        const pax = paxRecords(data);
        pending = { path: pax.get('path'), linkpath: pax.get('linkpath') };
        continue;
      }
      if (type === 'L') {
        pending = { ...pending, path: cString(data) };
        continue;
      }
      if (type === 'K') {
        pending = { ...pending, linkpath: cString(data) };
        continue;
      }
      const prefix = cString(header.subarray(345, 500));
      const name = pending.path ?? (prefix ? `${prefix}/${cString(header.subarray(0, 100))}` : cString(header.subarray(0, 100)));
      const linkName = pending.linkpath ?? cString(header.subarray(157, 257));
      pending = {};

      const rel = repoPath(name);
      if (rel === undefined) continue;
      if (type === '0') {
        this.members.set(rel, { entry: { path: rel, kind: 'file', size }, data });
      } else if (type === '2' || type === '1') {
        // Hard links are treated as unresolvable links rather than followed.
        this.members.set(rel, { entry: { path: rel, kind: 'symlink', size: 0 }, link: type === '2' ? linkName : undefined });
      }
    }
    this.commit = commit && /^[0-9a-f]{40}$/.test(commit) ? commit : undefined;
  }

  /** Gunzips with an output ceiling, so a decompression bomb fails instead of exhausting memory. */
  static fromGzip(gz: Uint8Array, label: string, maxBytes: number): TarSource {
    try {
      return new TarSource(gunzipSync(gz, { maxOutputLength: maxBytes }), label);
    } catch (error) {
      if (error instanceof TarError) throw error;
      throw new TarError('archive is not a readable gzip stream or exceeds the size limit');
    }
  }

  async list(): Promise<TreeEntry[]> {
    return [...this.members.values()].map((m) => m.entry).sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  }

  async read(path: string): Promise<Uint8Array | undefined> {
    return this.members.get(path)?.data;
  }

  async readLink(path: string): Promise<string | undefined> {
    const link = this.members.get(path)?.link;
    return link !== undefined && link.length <= MAX_LINK_BYTES ? link : undefined;
  }
}
