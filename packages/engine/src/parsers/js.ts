/**
 * A small single-pass JavaScript/TypeScript tokenizer. It tells code apart
 * from strings, comments, templates and regular expressions, which is all the
 * payload rules need. It never builds an AST and never evaluates anything;
 * running time is linear in the input.
 */

export type TokenType = 'ident' | 'punct' | 'string' | 'template' | 'regex' | 'number' | 'comment' | 'ws';

export interface Token {
  type: TokenType;
  start: number;
  end: number;
  /** Identifier name, punctuator character, or the decoded body of a plain string literal. */
  value: string;
}

const REGEX_AFTER_KEYWORD = new Set([
  'return',
  'typeof',
  'instanceof',
  'in',
  'of',
  'new',
  'delete',
  'void',
  'throw',
  'case',
  'do',
  'else',
  'yield',
  'await',
]);

function isIdentStart(code: number): boolean {
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || code === 36 || code === 95 || code >= 128;
}

function isIdentPart(code: number): boolean {
  return isIdentStart(code) || (code >= 48 && code <= 57);
}

export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  /** For each open `{`: true when it was opened by `${` inside a template. */
  const braces: boolean[] = [];
  let lastSig: Token | undefined;
  let i = 0;
  const n = text.length;

  const push = (type: TokenType, start: number, end: number, value = '') => {
    const token = { type, start, end, value };
    tokens.push(token);
    if (type !== 'ws' && type !== 'comment') lastSig = token;
  };

  /** Reads template characters from `i` up to the closing backtick or a `${`. */
  const readTemplate = (start: number) => {
    while (i < n) {
      const c = text[i];
      if (c === '\\') {
        i += 2;
      } else if (c === '`') {
        i++;
        push('template', start, i);
        return;
      } else if (c === '$' && text[i + 1] === '{') {
        i += 2;
        push('template', start, i);
        braces.push(true);
        return;
      } else {
        i++;
      }
    }
    push('template', start, n);
  };

  while (i < n) {
    const start = i;
    const c = text[i]!;
    const code = text.charCodeAt(i);
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f' || c === '\v' || code === 0xa0 || code === 0xfeff) {
      while (i < n && /[\s﻿\xA0]/.test(text[i]!)) i++;
      push('ws', start, i);
    } else if (c === '/' && text[i + 1] === '/') {
      const nl = text.indexOf('\n', i);
      i = nl === -1 ? n : nl;
      push('comment', start, i);
    } else if (c === '/' && text[i + 1] === '*') {
      const close = text.indexOf('*/', i + 2);
      i = close === -1 ? n : close + 2;
      push('comment', start, i);
    } else if (c === '"' || c === "'") {
      i++;
      let body = '';
      while (i < n && text[i] !== c && text[i] !== '\n') {
        if (text[i] === '\\') {
          body += text[i + 1] ?? '';
          i += 2;
        } else {
          body += text[i];
          i++;
        }
      }
      i++;
      push('string', start, Math.min(i, n), body);
    } else if (c === '`') {
      i++;
      readTemplate(start);
    } else if (c === '}' && braces.length && braces[braces.length - 1]) {
      braces.pop();
      i++;
      readTemplate(start);
    } else if (isIdentStart(code)) {
      while (i < n && isIdentPart(text.charCodeAt(i))) i++;
      push('ident', start, i, text.slice(start, i));
    } else if (code >= 48 && code <= 57) {
      while (i < n && /[\w.]/.test(text[i]!)) i++;
      push('number', start, i);
    } else if (c === '/' && regexAllowed(lastSig)) {
      i++;
      let inClass = false;
      while (i < n && text[i] !== '\n') {
        const d = text[i];
        if (d === '\\') {
          i += 2;
          continue;
        }
        if (d === '[') inClass = true;
        else if (d === ']') inClass = false;
        else if (d === '/' && !inClass) break;
        i++;
      }
      i++;
      while (i < n && isIdentPart(text.charCodeAt(i))) i++;
      push('regex', start, Math.min(i, n));
    } else {
      if (c === '{') braces.push(false);
      else if (c === '}') braces.pop();
      i++;
      push('punct', start, i, c);
    }
  }
  return tokens;
}

function regexAllowed(prev: Token | undefined): boolean {
  if (!prev) return true;
  if (prev.type === 'punct') return !(prev.value === ')' || prev.value === ']' || prev.value === '}');
  if (prev.type === 'ident') return REGEX_AFTER_KEYWORD.has(prev.value);
  return false;
}

export function significant(tokens: Token[]): Token[] {
  return tokens.filter((t) => t.type !== 'ws' && t.type !== 'comment');
}

const OPEN = new Set(['(', '[', '{']);
const CLOSE = new Set([')', ']', '}']);
const CONTINUES = new Set(['.', '(', '[', '?', ',', '+', '-', '*', '/', '%', '=', '&', '|', '^', ':', '<', '>', '!']);
const CONTINUES_IDENT = new Set(['as', 'satisfies', 'instanceof', 'in']);

export interface ModuleTail {
  /** Offset of the first code token after the module's export statement. */
  offset: number;
  /** Longest run of spaces/tabs between the export statement and that code. */
  padding: number;
}

/**
 * Finds code that follows a config module's `export default …` or
 * `module.exports = …` statement. Returns undefined when the export is the
 * last statement in the file.
 */
export function findModuleTail(text: string, tokens: Token[] = tokenize(text)): ModuleTail | undefined {
  const sig = significant(tokens);
  let depth = 0;
  let begin = -1;
  for (let k = 0; k < sig.length; k++) {
    const t = sig[k]!;
    if (t.type === 'punct' && OPEN.has(t.value)) depth++;
    else if (t.type === 'punct' && CLOSE.has(t.value)) depth = Math.max(0, depth - 1);
    else if (depth === 0 && t.type === 'ident' && t.value === 'export' && sig[k + 1]?.value === 'default') {
      begin = k + 2;
      break;
    } else if (
      depth === 0 &&
      t.type === 'ident' &&
      t.value === 'module' &&
      sig[k + 1]?.value === '.' &&
      sig[k + 2]?.value === 'exports' &&
      sig[k + 3]?.value === '='
    ) {
      begin = k + 4;
      break;
    }
  }
  if (begin === -1 || begin >= sig.length) return undefined;

  const isDeclaration = ['function', 'class', 'async'].includes(sig[begin]!.value);
  let end = -1;
  depth = 0;
  let sawBlock = false;
  for (let k = begin; k < sig.length; k++) {
    const t = sig[k]!;
    if (t.type === 'punct' && OPEN.has(t.value)) {
      depth++;
      if (t.value === '{') sawBlock = true;
      continue;
    }
    if (t.type === 'punct' && CLOSE.has(t.value)) {
      depth = Math.max(0, depth - 1);
      if (depth === 0 && isDeclaration && sawBlock && t.value === '}') {
        end = k + 1;
        break;
      }
      continue;
    }
    if (depth !== 0) continue;
    if (t.type === 'punct' && t.value === ';') {
      end = k + 1;
      break;
    }
    const prev = sig[k - 1]!;
    if (k > begin && newlineBetween(text, prev.end, t.start)) {
      const prevEndsExpr = !(prev.type === 'punct' && CONTINUES.has(prev.value) && !CLOSE.has(prev.value));
      const tContinues = (t.type === 'punct' && CONTINUES.has(t.value)) || (t.type === 'ident' && CONTINUES_IDENT.has(t.value));
      if (prevEndsExpr && !tContinues) {
        end = k;
        break;
      }
    }
  }
  if (end === -1 || end >= sig.length) return undefined;
  const tail = sig[end]!;
  const gapStart = sig[end - 1]!.end;
  return { offset: tail.start, padding: longestBlankRun(text, gapStart, tail.start) };
}

function newlineBetween(text: string, from: number, to: number): boolean {
  const nl = text.indexOf('\n', from);
  return nl !== -1 && nl < to;
}

function longestBlankRun(text: string, from: number, to: number): number {
  let best = 0;
  let run = 0;
  for (let i = from; i < to; i++) {
    const c = text[i];
    if (c === ' ' || c === '\t') {
      run++;
      if (run > best) best = run;
    } else {
      run = 0;
    }
  }
  return best;
}

/** Offset and length of the longest blank run that is followed by code on the same line. */
export function longestPaddedLine(text: string): { offset: number; padding: number } | undefined {
  let best: { offset: number; padding: number } | undefined;
  let runStart = -1;
  for (let i = 0; i <= text.length; i++) {
    const c = text[i];
    if (c === ' ' || c === '\t') {
      if (runStart === -1) runStart = i;
    } else {
      if (runStart !== -1 && c !== undefined && c !== '\n' && c !== '\r') {
        const padding = i - runStart;
        if (!best || padding > best.padding) best = { offset: i, padding };
      }
      runStart = -1;
    }
  }
  return best;
}

export type ConstructionKind = 'eval' | 'function' | 'vm' | 'hiddenSpawn';

/** Places where code builds and runs code at runtime. Matches code tokens only, never strings or comments. */
export function findCodeConstruction(tokens: Token[]): { kind: ConstructionKind; offset: number }[] {
  const sig = significant(tokens);
  const out: { kind: ConstructionKind; offset: number }[] = [];
  let detached = -1;
  let hidden = false;
  let unref = false;
  let spawnLike = false;
  for (let k = 0; k < sig.length; k++) {
    const t = sig[k]!;
    if (t.type !== 'ident') continue;
    const next = sig[k + 1];
    const prev = sig[k - 1];
    const declared = prev?.type === 'ident' && (prev.value === 'function' || prev.value === 'class');
    if (declared) continue;
    if (t.value === 'eval' && next?.value === '(') out.push({ kind: 'eval', offset: t.start });
    else if (t.value === 'Function' && (next?.value === '(' || prev?.value === 'new')) out.push({ kind: 'function', offset: t.start });
    else if (
      ['runInThisContext', 'runInNewContext', 'runInContext', 'compileFunction'].includes(t.value) &&
      next?.value === '('
    ) {
      out.push({ kind: 'vm', offset: t.start });
    } else if (t.value === 'Script' && prev?.value === '.' && sig[k - 2]?.value === 'vm') {
      out.push({ kind: 'vm', offset: t.start });
    } else if (t.value === 'detached' && next?.value === ':' && sig[k + 2]?.value === 'true') {
      detached = t.start;
    } else if (t.value === 'windowsHide' || (t.value === 'stdio' && sig[k + 2]?.type === 'string' && sig[k + 2]?.value === 'ignore')) {
      hidden = true;
    } else if (t.value === 'unref' && next?.value === '(') {
      unref = true;
    } else if (['spawn', 'exec', 'execFile', 'fork'].includes(t.value) && next?.value === '(') {
      spawnLike = true;
    }
  }
  if (detached !== -1 && hidden && unref && spawnLike) out.push({ kind: 'hiddenSpawn', offset: detached });
  return out;
}

const NETWORK_IDENTS = new Set(['fetch', 'axios', 'got', 'XMLHttpRequest', 'WebSocket', 'superagent', 'needle', 'ky']);

/** True when code tokens call a network API. */
export function usesNetwork(tokens: Token[]): boolean {
  const sig = significant(tokens);
  for (let k = 0; k < sig.length; k++) {
    const t = sig[k]!;
    if (t.type !== 'ident') continue;
    if (NETWORK_IDENTS.has(t.value)) return true;
    if ((t.value === 'http' || t.value === 'https' || t.value === 'net' || t.value === 'tls') && sig[k + 1]?.value === '.') {
      const member = sig[k + 2]?.value;
      if (member === 'request' || member === 'get' || member === 'connect') return true;
    }
    if (t.type === 'ident' && t.value === 'require' && sig[k + 2]?.type === 'string') {
      const mod = sig[k + 2]!.value.replace(/^node:/, '');
      if (['http', 'https', 'net', 'tls', 'axios', 'node-fetch', 'request', 'got'].includes(mod)) return true;
    }
  }
  return false;
}

/** Offsets where the whole `process.env` object is used rather than one variable. */
export function wholeProcessEnv(tokens: Token[]): number[] {
  const sig = significant(tokens);
  const out: number[] = [];
  for (let k = 0; k + 2 < sig.length; k++) {
    if (sig[k]!.value === 'process' && sig[k + 1]!.value === '.' && sig[k + 2]!.value === 'env') {
      const after = sig[k + 3];
      const member = after?.value === '.' || after?.value === '[' || (after?.value === '?' && sig[k + 4]?.value === '.');
      if (!member && sig[k - 1]?.value !== '.') out.push(sig[k]!.start);
    }
  }
  return out;
}

export interface StringCall {
  callee: string;
  arg: string;
  offset: number;
}

/** Calls of the form `name('literal', …)`, e.g. `require('./x')` or `readFileSync('a.woff')`. */
export function stringCalls(tokens: Token[], names: ReadonlySet<string>): StringCall[] {
  const sig = significant(tokens);
  const out: StringCall[] = [];
  for (let k = 0; k + 2 < sig.length; k++) {
    const t = sig[k]!;
    if (t.type === 'ident' && names.has(t.value) && sig[k + 1]!.value === '(') {
      const arg = sig[k + 2]!;
      if (arg.type === 'string') out.push({ callee: t.value, arg: arg.value, offset: arg.start });
    }
  }
  return out;
}
