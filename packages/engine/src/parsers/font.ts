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

function checkWoff2(b: Uint8Array): boolean {
  if (b.length < 48) return false;
  const length = u32(b, 8);
  const numTables = u16(b, 12);
  const totalCompressedSize = u32(b, 20);
  if (length !== b.length || u16(b, 14) !== 0) return false;
  if (numTables === 0 || numTables > MAX_TABLES) return false;
  return 48 + totalCompressedSize <= b.length;
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
  if (eotSize !== b.length || fontDataSize === 0 || fontDataSize > eotSize) return false;
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
