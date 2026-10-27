/** SEP-23 strkey helpers, implemented here to keep the engine free of network-capable SDKs. */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const SEED_VERSION = 18 << 3;

export function base32Decode(input: string): Uint8Array | undefined {
  const out: number[] = [];
  let bits = 0;
  let value = 0;
  for (const c of input) {
    const idx = ALPHABET.indexOf(c);
    if (idx === -1) return undefined;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
}

export function base32Encode(bytes: Uint8Array): string {
  let out = '';
  let bits = 0;
  let value = 0;
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

/** CRC16-XModem, as used by strkey checksums. */
export function crc16xmodem(bytes: Uint8Array): number {
  let crc = 0;
  for (const b of bytes) {
    crc ^= b << 8;
    for (let i = 0; i < 8; i++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc;
}

export function strkeyIsValidSeed(candidate: string): boolean {
  if (candidate.length !== 56 || candidate[0] !== 'S') return false;
  const raw = base32Decode(candidate);
  if (!raw || raw.length !== 35 || raw[0] !== SEED_VERSION) return false;
  const crc = crc16xmodem(raw.subarray(0, 33));
  return raw[33] === (crc & 0xff) && raw[34] === crc >> 8;
}

/** Encodes 32 bytes as an `S…` secret seed. Used to build inert test inputs at runtime. */
export function encodeSeed(payload: Uint8Array): string {
  const body = new Uint8Array(35);
  body[0] = SEED_VERSION;
  body.set(payload.subarray(0, 32), 1);
  const crc = crc16xmodem(body.subarray(0, 33));
  body[33] = crc & 0xff;
  body[34] = crc >> 8;
  return base32Encode(body);
}
