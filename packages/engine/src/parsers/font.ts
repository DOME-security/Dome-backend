/**
 * Validates font files by their structural header fields, not just their
 * magic bytes, so a script with a font extension (or a script with four
 * correct bytes glued to the front) does not pass.
 */

export type FontFormat = 'woff' | 'woff2' | 'sfnt' | 'ttc' | 'eot';

export type FontCheck =
  | { valid: true; format: FontFormat }
  | { valid: false; problem: 'empty' | 'unknown-signature' | 'bad-header' | 'lfs-pointer' };

const MAX_TABLES = 1024;

function u16(b: Uint8Array, o: number): number {
  return (b[o]! << 8) | b[o + 1]!;
}

function u32(b: Uint8Array, o: number): number {
  return ((b[o]! << 24) >>> 0) + (b[o + 1]! << 16) + (b[o + 2]! << 8) + b[o + 3]!;
}

function u16le(b: Uint8Array, o: number): number {
  return b[o]! | (b[o + 1]! << 8);
}

function u32le(b: Uint8Array, o: number): number {
  return (b[o]! | (b[o + 1]! << 8) | (b[o + 2]! << 16)) + ((b[o + 3]! << 24) >>> 0);
}

function isTag(b: Uint8Array, o: number): boolean {
  for (let i = 0; i < 4; i++) {
    const c = b[o + i]!;
    if (c < 0x20 || c > 0x7e) return false;
  }
  return true;
}

const LFS_POINTER = new TextEncoder().encode('version https://git-lfs.github.com/spec/');

export function isLfsPointer(bytes: Uint8Array): boolean {
  if (bytes.length > 1024 || bytes.length < LFS_POINTER.length) return false;
  return LFS_POINTER.every((c, i) => bytes[i] === c);
}

function checkWoff(b: Uint8Array): boolean {
  if (b.length < 44) return false;
  const length = u32(b, 8);
  const numTables = u16(b, 12);
  if (length !== b.length || u16(b, 14) !== 0) return false;
  if (numTables === 0 || numTables > MAX_TABLES || 44 + numTables * 20 > b.length) return false;
  for (let t = 0; t < numTables; t++) {
    const e = 44 + t * 20;
    if (!isTag(b, e)) return false;
    const offset = u32(b, e + 4);
    const compLength = u32(b, e + 8);
    const origLength = u32(b, e + 12);
    if (offset < 44 || offset + compLength > b.length || compLength > origLength) return false;
  }
  return true;
}

/** Reads a WOFF2 UIntBase128 at `o`. Returns [value, next offset] or undefined if malformed. */
function uintBase128(b: Uint8Array, o: number): [number, number] | undefined {
  let value = 0;
  for (let i = 0; i < 5; i++) {
    const byte = b[o + i];
    if (byte === undefined || (i === 0 && byte === 0x80)) return undefined; // no leading zeros
    if (value > 0x1ffffff) return undefined; // would overflow 32 bits
    value = value * 128 + (byte & 0x7f);
    if ((byte & 0x80) === 0) return [value, o + i + 1];
  }
  return undefined;
}

/** Reads a WOFF2 255UInt16 at `o`. Returns [value, next offset] or undefined. */
function uint255(b: Uint8Array, o: number): [number, number] | undefined {
  const code = b[o];
  if (code === undefined) return undefined;
  if (code === 253) return o + 2 < b.length ? [u16(b, o + 1), o + 3] : undefined;
  if (code === 255) return o + 1 < b.length ? [b[o + 1]! + 253, o + 2] : undefined;
  if (code === 254) return o + 1 < b.length ? [b[o + 1]! + 506, o + 2] : undefined;
  return [code, o + 1];
}

const WOFF2_FLAVORS = new Set([0x00010000, 0x4f54544f, 0x74727565, 0x74746366]);
const TAG_GLYF = 0x676c7966;
const TAG_LOCA = 0x6c6f6361;
// Known-tag indices 10 and 11 are glyf and loca, whose null transform is version 3.
const KNOWN_GLYF = 10;
const KNOWN_LOCA = 11;

/**
 * WOFF2 (W3C WOFF2 §4-5): header fields, the variable-length table directory,
 * the collection directory for TTC flavors, and the bounds of the compressed
 * stream and the metadata and private blocks.
 */
function checkWoff2(b: Uint8Array): boolean {
  if (b.length < 48) return false;
  const flavor = u32(b, 4);
  const length = u32(b, 8);
  const numTables = u16(b, 12);
  const totalCompressedSize = u32(b, 20);
  if (!WOFF2_FLAVORS.has(flavor) || length !== b.length || u16(b, 14) !== 0) return false;
  if (numTables === 0 || numTables > MAX_TABLES || totalCompressedSize === 0) return false;

  let o = 48;
  for (let t = 0; t < numTables; t++) {
    const flags = b[o];
    if (flags === undefined) return false;
    o++;
    const tagIndex = flags & 0x3f;
    const transform = flags >> 6;
    let tag = 0;
    if (tagIndex === 63) {
      if (o + 4 > b.length || !isTag(b, o)) return false;
      tag = u32(b, o);
      o += 4;
    }
    const orig = uintBase128(b, o);
    if (!orig) return false;
    o = orig[1];
    const isGlyfOrLoca = tagIndex === KNOWN_GLYF || tagIndex === KNOWN_LOCA || tag === TAG_GLYF || tag === TAG_LOCA;
    if (isGlyfOrLoca ? transform !== 3 : transform !== 0) {
      const transformed = uintBase128(b, o);
      if (!transformed) return false;
      o = transformed[1];
    }
  }

  if (flavor === 0x74746366) {
    if (o + 4 > b.length) return false;
    const version = u32(b, o);
    if (version !== 0x00010000 && version !== 0x00020000) return false;
    let fonts = uint255(b, o + 4);
    if (!fonts || fonts[0] === 0) return false;
    o = fonts[1];
    for (let f = 0, n = fonts[0]; f < n; f++) {
      const tables = uint255(b, o);
      if (!tables || tables[0] === 0 || tables[0] > numTables) return false;
      o = tables[1] + 4; // flavor
      for (let t = 0; t < tables[0]; t++) {
        const index = uint255(b, o);
        if (!index || index[0] >= numTables) return false;
        o = index[1];
      }
      fonts = [n, o];
    }
  }

  if (o + totalCompressedSize > b.length) return false;
  const block = (offset: number, size: number) => (offset === 0 ? size === 0 : offset >= o + totalCompressedSize && offset + size <= b.length);
  return block(u32(b, 28), u32(b, 32)) && block(u32(b, 40), u32(b, 44));
}

function checkSfnt(b: Uint8Array, base = 0): boolean {
  if (b.length < base + 12) return false;
  const numTables = u16(b, base + 4);
  if (numTables === 0 || numTables > MAX_TABLES || base + 12 + numTables * 16 > b.length) return false;
  for (let t = 0; t < numTables; t++) {
    const e = base + 12 + t * 16;
    if (!isTag(b, e)) return false;
    const offset = u32(b, e + 8);
    const length = u32(b, e + 12);
    if (offset < 12 || offset + length > b.length + 3) return false;
  }
  return true;
}

function checkTtc(b: Uint8Array): boolean {
  if (b.length < 16) return false;
  const numFonts = u32(b, 8);
  if (numFonts === 0 || numFonts > 256 || 12 + numFonts * 4 > b.length) return false;
  for (let f = 0; f < numFonts; f++) {
    if (!checkSfnt(b, u32(b, 12 + f * 4))) return false;
  }
  return true;
}

function checkEot(b: Uint8Array): boolean {
  if (b.length < 82) return false;
  const eotSize = u32le(b, 0);
  const fontDataSize = u32le(b, 4);
  const version = u32le(b, 8);
  if (eotSize !== b.length || fontDataSize === 0 || fontDataSize > eotSize - 82) return false;
  if (![0x00010000, 0x00020001, 0x00020002].includes(version)) return false;
  return u16le(b, 34) === 0x504c;
}

export function checkFont(bytes: Uint8Array): FontCheck {
  if (bytes.length === 0) return { valid: false, problem: 'empty' };
  if (isLfsPointer(bytes)) return { valid: false, problem: 'lfs-pointer' };
  if (bytes.length < 4) return { valid: false, problem: 'unknown-signature' };
  const sig = u32(bytes, 0);
  const result = (ok: boolean, format: FontFormat): FontCheck =>
    ok ? { valid: true, format } : { valid: false, problem: 'bad-header' };
  switch (sig) {
    case 0x774f4646: // 'wOFF'
      return result(checkWoff(bytes), 'woff');
    case 0x774f4632: // 'wOF2'
      return result(checkWoff2(bytes), 'woff2');
    case 0x00010000:
    case 0x4f54544f: // 'OTTO'
    case 0x74727565: // 'true'
    case 0x74797031: // 'typ1'
      return result(checkSfnt(bytes), 'sfnt');
    case 0x74746366: // 'ttcf'
      return result(checkTtc(bytes), 'ttc');
    default:
      if (bytes.length >= 82 && u16le(bytes, 34) === 0x504c) return result(checkEot(bytes), 'eot');
      return { valid: false, problem: 'unknown-signature' };
  }
}
