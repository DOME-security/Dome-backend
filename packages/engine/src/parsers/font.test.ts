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

  it('recognizes git LFS pointers and empty files', () => {
    expect(checkFont(text('version https://git-lfs.github.com/spec/v1\noid sha256:abc\nsize 10\n'))).toEqual({
      valid: false,
      problem: 'lfs-pointer',
    });
    expect(checkFont(new Uint8Array())).toEqual({ valid: false, problem: 'empty' });
  });
});
