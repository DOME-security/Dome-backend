import { describe, expect, it } from 'vitest';
import { buildSfnt, buildWoff, buildWoff2 } from '../__fixtures__/fonts.js';
import { checkFont } from './font.js';

function buildEot(): Uint8Array {
  const b = new Uint8Array(100);
  const v = new DataView(b.buffer);
  v.setUint32(0, b.length, true);
  v.setUint32(4, 10, true);
  v.setUint32(8, 0x00020001, true);
  v.setUint16(34, 0x504c, true);
  return b;
}

const text = (s: string) => new TextEncoder().encode(s);

describe('checkFont', () => {
  it('accepts structurally valid fonts', () => {
    expect(checkFont(buildSfnt())).toEqual({ valid: true, format: 'sfnt' });
    expect(checkFont(buildWoff())).toEqual({ valid: true, format: 'woff' });
    expect(checkFont(buildWoff2())).toEqual({ valid: true, format: 'woff2' });
    expect(checkFont(buildEot())).toEqual({ valid: true, format: 'eot' });
  });

  it('rejects text pretending to be a font', () => {
    expect(checkFont(text('DOME_FIXTURE_NOT_A_FONT'))).toEqual({ valid: false, problem: 'unknown-signature' });
  });

  it('rejects correct magic bytes in front of a script', () => {
    const fake = new Uint8Array([0x77, 0x4f, 0x46, 0x32, ...text('/* DOME_FIXTURE */ '.repeat(10))]);
    expect(checkFont(fake)).toEqual({ valid: false, problem: 'bad-header' });
  });

  it('rejects a WOFF whose declared length does not match', () => {
    const woff = buildWoff();
    new DataView(woff.buffer).setUint32(8, 9999);
    expect(checkFont(woff).valid).toBe(false);
  });

  it('accepts a TrueType collection and a WOFF2-wrapped collection', () => {
    const sfnt = buildSfnt();
    const ttc = new Uint8Array(16 + sfnt.length);
    const v = new DataView(ttc.buffer);
    v.setUint32(0, 0x74746366);
    v.setUint32(4, 0x00010000);
    v.setUint32(8, 1);
    v.setUint32(12, 16);
    ttc.set(sfnt, 16);
    expect(checkFont(ttc)).toEqual({ valid: true, format: 'ttc' });
    v.setUint32(8, 0);
    expect(checkFont(ttc).valid).toBe(false);

    const collection = [0x00, 0x01, 0x00, 0x00, 1, 1, 0x00, 0x01, 0x00, 0x00, 0]; // version, 1 font, 1 table, flavor, index 0
    const directory = [0x01, 0x36];
    const w = new Uint8Array(48 + directory.length + collection.length + 16);
    const wv = new DataView(w.buffer);
    wv.setUint32(0, 0x774f4632);
    wv.setUint32(4, 0x74746366);
    wv.setUint32(8, w.length);
    wv.setUint16(12, 1);
    wv.setUint32(20, 16);
    w.set(directory, 48);
    w.set(collection, 48 + directory.length);
    expect(checkFont(w)).toEqual({ valid: true, format: 'woff2' });
    w[48 + directory.length + 10] = 5; // table index out of range
    expect(checkFont(w).valid).toBe(false);
  });

  it('accepts 255UInt16 and multi-byte UIntBase128 encodings', () => {
    const b = buildWoff2();
    const longer = new Uint8Array(b.length + 1);
    longer.set(b.subarray(0, 49));
    longer.set([0x81, 0x00], 49); // origLength 128 in two bytes
    longer.set(b.subarray(50), 51);
    new DataView(longer.buffer).setUint32(8, longer.length);
    expect(checkFont(longer)).toEqual({ valid: true, format: 'woff2' });
  });

  it('rejects an EOT whose font data does not fit or whose version is unknown', () => {
    const eot = buildEot();
    new DataView(eot.buffer).setUint32(4, 99, true);
    expect(checkFont(eot).valid).toBe(false);
    const eot2 = buildEot();
    new DataView(eot2.buffer).setUint32(8, 7, true);
    expect(checkFont(eot2).valid).toBe(false);
  });

  describe('WOFF2', () => {
    const edit = (fn: (b: Uint8Array, v: DataView) => void) => {
      const b = buildWoff2();
      fn(b, new DataView(b.buffer));
      return checkFont(b).valid;
    };

    it('rejects an unknown flavor or a non-zero reserved field', () => {
      expect(edit((_b, v) => v.setUint32(4, 0x41414141))).toBe(false);
      expect(edit((_b, v) => v.setUint16(14, 1))).toBe(false);
    });

    it('rejects a malformed table directory', () => {
      expect(edit((b) => (b[49] = 0x80))).toBe(false); // UIntBase128 with a leading zero byte
      expect(edit((b) => (b[48] = 63))).toBe(false); // arbitrary tag that is not printable
      expect(edit((b) => (b[48] = 0x41))).toBe(false); // transformed head needs a transformLength
    });

    it('rejects a compressed stream or metadata block outside the file', () => {
      expect(edit((_b, v) => v.setUint32(20, 1000))).toBe(false);
      expect(edit((_b, v) => {
        v.setUint32(28, 60);
        v.setUint32(32, 1000);
      })).toBe(false);
    });

    it('rejects a copied header whose table directory runs past the end', () => {
      const script = text('/* DOME_FIXTURE */');
      const b = new Uint8Array(48 + script.length);
      b.set(buildWoff2().subarray(0, 48));
      b.set(script, 48);
      const v = new DataView(b.buffer);
      v.setUint32(8, b.length);
      v.setUint16(12, 40);
      expect(checkFont(b).valid).toBe(false);
    });
  });

  it('recognizes git LFS pointers and empty files', () => {
    expect(checkFont(text('version https://git-lfs.github.com/spec/v1\noid sha256:abc\nsize 10\n'))).toEqual({
      valid: false,
      problem: 'lfs-pointer',
    });
    expect(checkFont(new Uint8Array())).toEqual({ valid: false, problem: 'empty' });
  });
});
