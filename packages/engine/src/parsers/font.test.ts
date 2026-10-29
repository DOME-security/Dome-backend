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
