import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { buildSfnt, buildWoff, buildWoff2 } from './__fixtures__/fonts.js';
import { UncheckableInput } from './parsers/errors.js';
import { checkFont } from './parsers/font.js';
import { findCodeConstruction, findModuleTail, longestPaddedLine, tokenize, usesNetwork, wholeProcessEnv } from './parsers/js.js';
import { nestingDepth, parseJsonc, value as nodeValue } from './parsers/jsonc.js';
import { parseDevcontainer, parsePackageJson } from './parsers/manifests.js';
import { downloadsAndRuns, nodeInvocations, parseShell, parseShellDeep } from './parsers/shell.js';
import { parseTasks, settingsNode } from './parsers/vscode.js';
import { scan } from './scan.js';
import { MemorySource } from './source/memory.js';

/**
 * Property tests for the parsers that read untrusted input. Each property
 * must hold for every generated input, and every call must finish well
 * inside PER_CALL_MS, so a parser that throws or hangs fails the suite.
 */
const PER_CALL_MS = 250;
const RUNS = Number(process.env.DOME_FUZZ_RUNS ?? 300);

function bounded<T>(fn: () => T): T {
  const start = performance.now();
  const value = fn();
  const ms = performance.now() - start;
  if (ms > PER_CALL_MS) throw new Error(`took ${Math.round(ms)}ms`);
  return value;
}

/** Strings built mostly from the characters that drive each parser's state machine. */
const shellish = fc.string({
  unit: fc.oneof(
    { weight: 3, arbitrary: fc.constantFrom(' ', '"', "'", '\\', '$', '(', ')', '`', '|', '&', ';', '<', '>', '\n', '#', '{', '}', '-c', '2>&1') },
    { weight: 2, arbitrary: fc.constantFrom('node', 'sh', 'curl', 'bash', '-r', '--import', '-e', 'cat', 'x.woff2', 'cmd', '/c', 'iex', 'iwr') },
    { weight: 1, arbitrary: fc.string({ maxLength: 4 }) },
  ),
  maxLength: 400,
});

const jsish = fc.string({
  unit: fc.oneof(
    { weight: 3, arbitrary: fc.constantFrom('`', '${', '}', '{', '"', "'", '/', '*', '\\', '\n', ' ', '(', ')', '[', ']', ';', '=', '.') },
    { weight: 2, arbitrary: fc.constantFrom('export', 'default', 'module', 'exports', 'eval', 'Function', 'new', 'return', 'process', 'env', 'fetch') },
    { weight: 1, arbitrary: fc.string({ maxLength: 4 }) },
  ),
  maxLength: 400,
});

const jsonish = fc.oneof(
  fc.json({ maxDepth: 6 }),
  fc.string({
    unit: fc.oneof(
      { weight: 3, arbitrary: fc.constantFrom('{', '}', '[', ']', '"', ':', ',', '\\', '/', '*', '\n', 'true', '"tasks"', '"command"', '"runOn"') },
      { weight: 1, arbitrary: fc.string({ maxLength: 4 }) },
    ),
    maxLength: 400,
  }),
);

describe('JSONC parser properties', () => {
  it('never throws (other than refusing deep nesting) and never hangs', () => {
    fc.assert(
      fc.property(jsonish, (text) => {
        try {
          bounded(() => parseJsonc(text));
        } catch (error) {
          if (!(error instanceof UncheckableInput)) throw error;
        }
      }),
      { numRuns: RUNS },
    );
  });

  it('parses any JSON value to the same value', () => {
    fc.assert(
      fc.property(fc.jsonValue({ maxDepth: 6 }), (value) => {
        const text = JSON.stringify(value);
        const { root, errors } = bounded(() => parseJsonc(text));
        expect(errors).toEqual([]);
        expect(nodeValue(root)).toEqual(JSON.parse(text));
      }),
      { numRuns: RUNS },
    );
  });

  it('measures the nesting depth JSON.stringify produced', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 200 }), (depth) => {
        let value: unknown = 1;
        for (let i = 0; i < depth; i++) value = i % 2 ? { a: value } : [value];
        expect(nestingDepth(JSON.stringify(value))).toBe(depth);
      }),
      { numRuns: 100 },
    );
  });

  it('task, settings, package and dev container readers never throw on parseable input', () => {
    fc.assert(
      fc.property(jsonish, (text) => {
        if (nestingDepth(text) > 256) return;
        bounded(() => {
          parseTasks('.vscode/tasks.json', text);
          parseTasks('x.code-workspace', text);
          settingsNode('.vscode/settings.json', text);
          parsePackageJson(text);
          parseDevcontainer(text);
        });
      }),
      { numRuns: RUNS },
    );
  });
});

describe('command tokenizer properties', () => {
  it('never throws and never hangs', () => {
    fc.assert(
      fc.property(shellish, (text) => {
        bounded(() => {
          parseShellDeep(text);
          nodeInvocations(text);
          downloadsAndRuns(text);
        });
      }),
      { numRuns: RUNS },
    );
  });

  const plainWord = fc.stringMatching(/^[A-Za-z0-9_./=:,+@%-]{1,12}$/);

  it('splits plain words on whitespace', () => {
    fc.assert(
      fc.property(fc.array(plainWord, { minLength: 1, maxLength: 8 }), (words) => {
        const [pipeline] = parseShell(words.join(' ')).pipelines;
        expect(pipeline?.commands[0]?.words).toEqual(words);
      }),
      { numRuns: RUNS },
    );
  });

  it('keeps a single-quoted string as one literal word', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 40 }).filter((s) => !s.includes("'")), (body) => {
        const { pipelines } = parseShell(`echo '${body}'`);
        expect(pipelines[0]?.commands[0]?.words).toEqual(['echo', body]);
      }),
      { numRuns: RUNS },
    );
  });

  it('finds the file node runs however the script is passed', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-z][a-z0-9/]{0,10}\.woff2$/),
        fc.constantFrom('node F', 'node -r F x.js', 'node --import=F x.js', 'sh -c "node F"', 'node < F', 'cat F | node', 'cmd /c node F'),
        (file, shape) => {
          const runs = nodeInvocations(shape.replace('F', file)).runs.map((r) => r.file);
          expect(runs).toContain(file);
        },
      ),
      { numRuns: RUNS },
    );
  });
});

describe('JavaScript tokenizer properties', () => {
  it('covers the input with contiguous tokens, never throws and never hangs', () => {
    fc.assert(
      fc.property(jsish, (text) => {
        const tokens = bounded(() => tokenize(text));
        let at = 0;
        for (const t of tokens) {
          expect(t.start).toBe(at);
          expect(t.end).toBeGreaterThan(t.start);
          at = t.end;
        }
        expect(at).toBe(text.length);
        bounded(() => {
          findModuleTail(text, tokens);
          findCodeConstruction(tokens);
          usesNetwork(tokens);
          wholeProcessEnv(tokens);
          longestPaddedLine(text);
        });
      }),
      { numRuns: RUNS },
    );
  });

  it('never reports code construction inside strings or comments', () => {
    fc.assert(
      fc.property(fc.constantFrom('eval(x)', 'new Function("x")', 'vm.runInThisContext(x)'), fc.constantFrom('"', "'", '`', '//', '/*'), (code, wrap) => {
        const text = wrap === '//' ? `// ${code}\n` : wrap === '/*' ? `/* ${code} */` : `${wrap}${code.replace(/["'`]/g, '')}${wrap}`;
        expect(findCodeConstruction(tokenize(text))).toEqual([]);
      }),
    );
  });
});

describe('font checker properties', () => {
  it('never throws on arbitrary bytes', () => {
    fc.assert(
      fc.property(fc.uint8Array({ maxLength: 512 }), (bytes) => {
        bounded(() => checkFont(bytes));
      }),
      { numRuns: RUNS },
    );
  });

  it('never throws on mutated valid fonts', () => {
    const fonts = [buildSfnt(), buildWoff(), buildWoff2()];
    fc.assert(
      fc.property(fc.nat(fonts.length - 1), fc.array(fc.tuple(fc.nat(127), fc.nat(255)), { maxLength: 8 }), (which, edits) => {
        const bytes = new Uint8Array(fonts[which]!);
        for (const [offset, value] of edits) if (offset < bytes.length) bytes[offset] = value;
        bounded(() => checkFont(bytes));
      }),
      { numRuns: RUNS },
    );
  });
});

describe('scan properties', () => {
  const paths = fc.constantFrom(
    '.vscode/tasks.json',
    '.vscode/settings.json',
    'package.json',
    '.devcontainer/devcontainer.json',
    '.github/workflows/ci.yml',
    'postcss.config.mjs',
    'app/api/route.ts',
    'public/fonts/a.woff2',
    '.env',
    '.claude/settings.json',
    'scripts/x.sh',
  );

  it('never throws on arbitrary trees and never reports clean for a file it could not check', async () => {
    await fc.assert(
      fc.asyncProperty(fc.dictionary(paths, fc.oneof(jsonish, jsish, shellish), { maxKeys: 6 }), async (files) => {
        const result = await scan({ source: new MemorySource(files) });
        if (result.incomplete.length > 0) expect(result.verdict).not.toBe('clean');
      }),
      { numRuns: Math.ceil(RUNS / 3) },
    );
  });
});
