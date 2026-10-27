import { describe, expect, it } from 'vitest';
import {
  findCodeConstruction,
  findModuleTail,
  longestPaddedLine,
  significant,
  stringCalls,
  tokenize,
  usesNetwork,
  wholeProcessEnv,
} from './js.js';

describe('tokenize', () => {
  it('separates code from strings, comments, templates and regexes', () => {
    const tokens = significant(tokenize("const a = 'eval(1)'; /* eval(2) */ const r = /eval\\(/g; `x ${eval} y`"));
    const idents = tokens.filter((t) => t.type === 'ident').map((t) => t.value);
    expect(idents).toEqual(['const', 'a', 'const', 'r', 'eval']);
  });

  it('treats a slash after an expression as division', () => {
    const types = significant(tokenize('a = b / c / d')).map((t) => t.type);
    expect(types).not.toContain('regex');
  });

  it('handles nested template expressions', () => {
    const tokens = significant(tokenize('`a ${`b ${c}`} d` + e'));
    expect(tokens.filter((t) => t.type === 'ident').map((t) => t.value)).toEqual(['c', 'e']);
  });

  it('is linear on pathological input', () => {
    const start = performance.now();
    tokenize('`${'.repeat(100_000) + '/'.repeat(100_000) + '"'.repeat(100_000));
    expect(performance.now() - start).toBeLessThan(2000);
  });
});

describe('findModuleTail', () => {
  it('returns nothing when the export is the last statement', () => {
    expect(findModuleTail('const config = { plugins: {} };\nexport default config;\n')).toBeUndefined();
    expect(findModuleTail('export default {\n  plugins: { tailwindcss: {} },\n}\n')).toBeUndefined();
    expect(findModuleTail('module.exports = {\n  a: 1,\n}\n// done\n')).toBeUndefined();
    expect(findModuleTail('export default defineConfig({\n  a: 1,\n})\n  .extend()\n')).toBeUndefined();
    expect(findModuleTail('export default config satisfies Config;\n')).toBeUndefined();
  });

  it('finds code after the module body and measures padding', () => {
    const padded = `export default { a: 1 };${' '.repeat(400)}global.x = 1; /* DOME_FIXTURE */\n`;
    const tail = findModuleTail(padded)!;
    expect(tail.padding).toBe(400);
    expect(padded.slice(tail.offset, tail.offset + 6)).toBe('global');
  });

  it('finds code on later lines after an ASI-terminated export', () => {
    const tail = findModuleTail('module.exports = {\n  a: 1\n}\nrequire("./x")\n')!;
    expect(tail.padding).toBe(0);
  });

  it('ends a default-exported function at its closing brace', () => {
    expect(findModuleTail('export default function f() { return 1 } doSomething()')).toBeDefined();
    expect(findModuleTail('export default function f() { return 1 }\n')).toBeUndefined();
  });
});

describe('longestPaddedLine', () => {
  it('measures blank runs followed by code on the same line', () => {
    expect(longestPaddedLine(`a;${' '.repeat(300)}b;`)?.padding).toBe(300);
    expect(longestPaddedLine(`a;${' '.repeat(300)}\nb;`)?.padding ?? 0).toBeLessThan(300);
  });
});

describe('findCodeConstruction', () => {
  it('finds eval, Function, vm and hidden detached spawns', () => {
    const kinds = (s: string) => findCodeConstruction(tokenize(s)).map((f) => f.kind);
    expect(kinds('eval(x)')).toEqual(['eval']);
    expect(kinds('new Function("return 1")()')).toEqual(['function']);
    expect(kinds('vm.runInThisContext(code)')).toEqual(['vm']);
    expect(kinds("spawn('node', [f], { detached: true, stdio: 'ignore', windowsHide: true }).unref()")).toEqual([
      'hiddenSpawn',
    ]);
    expect(kinds("const s = 'eval(x)'; // new Function()")).toEqual([]);
    expect(kinds('function Function() {}')).toEqual([]);
  });
});

describe('network and environment helpers', () => {
  it('spots whole-environment use alongside network calls', () => {
    const tokens = tokenize("axios.post(url, { data: process.env }); const k = process.env.KEY;");
    expect(usesNetwork(tokens)).toBe(true);
    expect(wholeProcessEnv(tokens)).toHaveLength(1);
  });

  it('collects string arguments of named calls', () => {
    const calls = stringCalls(tokenize("require('./a.woff2'); fs.readFileSync(\"b.png\")"), new Set(['require', 'readFileSync']));
    expect(calls.map((c) => c.arg)).toEqual(['./a.woff2', 'b.png']);
  });
});
