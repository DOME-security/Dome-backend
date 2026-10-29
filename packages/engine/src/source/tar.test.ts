import { gzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { scan } from '../scan.js';
import { TarError, TarSource } from './tar.js';

interface Member {
  name: string;
  data?: string;
  type?: string;
  link?: string;
}

/** Builds a ustar archive by hand; the archives under test are never read from disk. */
function tar(members: Member[], global?: string): Uint8Array {
  const blocks: Buffer[] = [];
  const header = (name: string, size: number, type: string, link = '') => {
    const h = Buffer.alloc(512);
    h.write(name, 0);
    h.write('0000644\0', 100);
    h.write(`${size.toString(8).padStart(11, '0')}\0`, 124);
    h.write(type, 156);
    h.write(link, 157);
    h.write('ustar\0', 257);
    return h;
  };
  const body = (text: string) => {
    const b = Buffer.from(text);
    return Buffer.concat([b, Buffer.alloc((512 - (b.length % 512)) % 512)]);
  };
  if (global) {
    const rec = ` comment=${global}\n`;
    const text = `${rec.length + String(rec.length).length}${rec}`;
    blocks.push(header('pax_global_header', Buffer.byteLength(text), 'g'), body(text));
  }
  for (const m of members) {
    const data = m.data ?? '';
    blocks.push(header(m.name, m.type === '2' ? 0 : Buffer.byteLength(data), m.type ?? '0', m.link), ...(m.type === '5' || m.type === '2' ? [] : [body(data)]));
  }
  blocks.push(Buffer.alloc(1024));
  return Buffer.concat(blocks);
}

const SHA = 'a'.repeat(40);

describe('TarSource', () => {
  it('lists files without the top-level folder and reads them', async () => {
    const src = new TarSource(tar([{ name: 'o-r-abc/', type: '5' }, { name: 'o-r-abc/src/a.js', data: 'DOME_FIXTURE' }], SHA));
    expect(src.commit).toBe(SHA);
    expect(await src.list()).toEqual([{ path: 'src/a.js', kind: 'file', size: 12 }]);
    expect(new TextDecoder().decode(await src.read('src/a.js'))).toBe('DOME_FIXTURE');
  });

  it('drops members that would leave the tree', async () => {
    const src = new TarSource(tar([{ name: 'o-r-abc/../../etc/x', data: 'x' }, { name: 'o-r-abc/ok.txt', data: 'y' }]));
    expect((await src.list()).map((e) => e.path)).toEqual(['ok.txt']);
  });

  it('lists links with their text and resolves them in a scan', async () => {
    const tasks = JSON.stringify({ tasks: [{ label: 'x', type: 'shell', command: 'echo DOME_FIXTURE', runOptions: { runOn: 'folderOpen' } }] });
    const src = new TarSource(
      tar([
        { name: 'o-r-abc/shared/vscode/tasks.json', data: tasks },
        { name: 'o-r-abc/.vscode', type: '2', link: 'shared/vscode' },
      ]),
    );
    expect(await src.readLink('.vscode')).toBe('shared/vscode');
    const result = await scan({ source: src });
    expect(result.findings.map((f) => f.ruleId)).toContain('DOME-VSC-001');
  });

  it('rejects a truncated archive and a gzip bomb', () => {
    const full = tar([{ name: 'o-r-abc/a', data: 'x'.repeat(2000) }]);
    expect(() => new TarSource(full.subarray(0, 700))).toThrow(TarError);
    expect(() => TarSource.fromGzip(gzipSync(Buffer.alloc(5_000_000)), 'bomb', 1_000_000)).toThrow(TarError);
    expect(() => TarSource.fromGzip(Buffer.from('not gzip'), 'bad', 1_000_000)).toThrow(TarError);
  });

  it('never throws anything but TarError on arbitrary bytes', () => {
    for (let seed = 1; seed < 200; seed++) {
      const bytes = Buffer.alloc(2048);
      for (let i = 0; i < bytes.length; i++) bytes[i] = (seed * 2654435761 + i * 40503) % 251;
      try {
        new TarSource(bytes);
      } catch (error) {
        expect(error).toBeInstanceOf(TarError);
      }
    }
  });
});
