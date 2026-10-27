/** Builders for structurally valid font headers, used by tests. */

/** Builds a minimal structurally valid sfnt (TrueType) file with one table. */
export function buildSfnt(): Uint8Array {
  const b = new Uint8Array(12 + 16 + 8);
  const v = new DataView(b.buffer);
  v.setUint32(0, 0x00010000);
  v.setUint16(4, 1);
  b.set([0x68, 0x65, 0x61, 0x64], 12); // 'head'
  v.setUint32(12 + 8, 28);
  v.setUint32(12 + 12, 8);
  return b;
}

/** Builds a minimal structurally valid WOFF wrapper with one table. */
export function buildWoff(): Uint8Array {
  const b = new Uint8Array(44 + 20 + 8);
  const v = new DataView(b.buffer);
  v.setUint32(0, 0x774f4646);
  v.setUint32(4, 0x00010000);
  v.setUint32(8, b.length);
  v.setUint16(12, 1);
  b.set([0x68, 0x65, 0x61, 0x64], 44);
  v.setUint32(44 + 4, 64);
  v.setUint32(44 + 8, 8);
  v.setUint32(44 + 12, 8);
  return b;
}

export function buildWoff2(): Uint8Array {
  const b = new Uint8Array(48 + 16);
  const v = new DataView(b.buffer);
  v.setUint32(0, 0x774f4632);
  v.setUint32(8, b.length);
  v.setUint16(12, 1);
  v.setUint32(20, 16);
  return b;
}
