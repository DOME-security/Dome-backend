/**
 * A quote-aware, single-pass tokenizer for the command lines found in VS Code
 * tasks, npm scripts and dev container hooks. It understands enough of POSIX
 * shell, cmd.exe and PowerShell to find what a command runs. It never expands
 * variables or globs and runs in linear time on any input.
 */

export interface SimpleCommand {
  words: string[];
  /** Target of a `<` input redirect. */
  stdinFrom?: string;
}

export interface Pipeline {
  commands: SimpleCommand[];
}

export interface ParsedShell {
  pipelines: Pipeline[];
  /** Text inside `$(...)`, backticks and `<(...)`, for nested analysis. */
  nested: string[];
}

const ESCAPABLE = new Set([' ', '\t', '"', "'", '$', '`', '\\', '\n', '|', '&', ';', '<', '>', '(', ')']);

/** Index just past the `)` matching an opening `(` at `start - 1`, ignoring quotes. */
function matchParen(text: string, start: number): number {
  let depth = 1;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (c === '(') depth++;
    else if (c === ')' && --depth === 0) return i + 1;
  }
  return text.length;
}

export function parseShell(text: string): ParsedShell {
  const pipelines: Pipeline[] = [];
  const nested: string[] = [];
  let pipeline: Pipeline = { commands: [] };
  let command: SimpleCommand = { words: [] };
  let word = '';
  let inWord = false;
  let pendingRedirect: 'in' | 'out' | undefined;

  const endWord = () => {
    if (!inWord) return;
    if (pendingRedirect === 'in') command.stdinFrom = word;
    else if (pendingRedirect !== 'out') command.words.push(word);
    pendingRedirect = undefined;
    word = '';
    inWord = false;
  };
  const endCommand = () => {
    endWord();
    if (command.words.length || command.stdinFrom) pipeline.commands.push(command);
    command = { words: [] };
  };
  const endPipeline = () => {
    endCommand();
    if (pipeline.commands.length) pipelines.push(pipeline);
    pipeline = { commands: [] };
  };

  let i = 0;
  while (i < text.length) {
    const c = text[i]!;
    const next = text[i + 1];
    if (c === ' ' || c === '\t' || c === '\r') {
      endWord();
      i++;
    } else if (c === '\n' || c === ';') {
      endPipeline();
      i++;
    } else if (c === '#' && !inWord) {
      while (i < text.length && text[i] !== '\n') i++;
    } else if (c === "'") {
      const close = text.indexOf("'", i + 1);
      const end = close === -1 ? text.length : close;
      word += text.slice(i + 1, end);
      inWord = true;
      i = end + 1;
    } else if (c === '"') {
      inWord = true;
      i++;
      while (i < text.length && text[i] !== '"') {
        const d = text[i]!;
        if (d === '\\' && i + 1 < text.length && '"\\$`'.includes(text[i + 1]!)) {
          word += text[i + 1];
          i += 2;
        } else if (d === '$' && text[i + 1] === '(') {
          const end = matchParen(text, i + 2);
          nested.push(text.slice(i + 2, end - 1));
          word += text.slice(i, end);
          i = end;
        } else if (d === '`') {
          const close = text.indexOf('`', i + 1);
          const end = close === -1 ? text.length : close;
          nested.push(text.slice(i + 1, end));
          i = end + 1;
        } else {
          word += d;
          i++;
        }
      }
      i++;
    } else if (c === '\\') {
      if (next !== undefined && ESCAPABLE.has(next)) {
        if (next !== '\n') word += next;
        i += 2;
      } else {
        word += c;
        i++;
      }
      inWord = true;
    } else if (c === '$' && next === '(') {
      const end = matchParen(text, i + 2);
      nested.push(text.slice(i + 2, end - 1));
      word += text.slice(i, end);
      inWord = true;
      i = end;
    } else if (c === '`') {
      const close = text.indexOf('`', i + 1);
      const end = close === -1 ? text.length : close;
      nested.push(text.slice(i + 1, end));
      inWord = true;
      i = end + 1;
    } else if (c === '<' && next === '(') {
      endWord();
      const end = matchParen(text, i + 2);
      nested.push(text.slice(i + 2, end - 1));
      command.words.push(text.slice(i, end));
      i = end;
    } else if (c === '<') {
      endWord();
      pendingRedirect = 'in';
      i += next === '<' ? 2 : 1;
    } else if (c === '>') {
      if (inWord && /^\d+$/.test(word)) {
        word = '';
        inWord = false;
      }
      endWord();
      i += next === '>' ? 2 : 1;
      if (text[i] === '&') {
        // `2>&1`: the target is a descriptor, not a file.
        i++;
        while (i < text.length && /\d/.test(text[i]!)) i++;
      } else {
        pendingRedirect = 'out';
      }
    } else if (c === '|') {
      if (next === '|') {
        endPipeline();
        i += 2;
      } else {
        endCommand();
        i++;
      }
    } else if (c === '&') {
      endPipeline();
      i += next === '&' ? 2 : 1;
    } else if ((c === '(' || c === ')' || c === '{' || c === '}') && !inWord) {
      endPipeline();
      i++;
    } else {
      word += c;
      inWord = true;
      i++;
    }
  }
  endPipeline();
  return { pipelines, nested };
}

/** Lowercase program name without directory or Windows executable suffix. */
export function programName(word: string | undefined): string {
  if (!word) return '';
  const base = word.slice(Math.max(word.lastIndexOf('/'), word.lastIndexOf('\\')) + 1).toLowerCase();
  return base.replace(/\.(?:exe|cmd|bat|com)$/, '');
}

const SHELLS = new Set(['sh', 'bash', 'zsh', 'dash', 'ksh', 'fish', 'ash']);
const POWERSHELLS = new Set(['powershell', 'pwsh']);

/**
 * Parses a command line and, recursively, the command strings handed to
 * `sh -c`, `cmd /c`, `powershell -Command` and command substitutions.
 * Nesting is capped so crafted input cannot multiply the work.
 */
export function parseShellDeep(text: string, maxDepth = 3): ParsedShell[] {
  const out: ParsedShell[] = [];
  const visit = (t: string, depth: number) => {
    const parsed = parseShell(t);
    out.push(parsed);
    if (depth >= maxDepth) return;
    for (const n of parsed.nested) visit(n, depth + 1);
    for (const p of parsed.pipelines) {
      for (const cmd of p.commands) {
        const inner = innerCommandString(cmd.words);
        if (inner !== undefined) visit(inner, depth + 1);
      }
    }
  };
  visit(text, 0);
  return out;
}

function innerCommandString(words: string[]): string | undefined {
  const prog = programName(words[0]);
  if (SHELLS.has(prog)) {
    const idx = words.findIndex((w, i) => i > 0 && /^-[a-z]*c[a-z]*$/.test(w));
    return idx === -1 ? undefined : words[idx + 1];
  }
  if (prog === 'cmd') {
    const idx = words.findIndex((w, i) => i > 0 && /^\/[ck]$/i.test(w));
    return idx === -1 ? undefined : words.slice(idx + 1).join(' ');
  }
  if (POWERSHELLS.has(prog)) {
    const idx = words.findIndex((w, i) => i > 0 && /^-(?:c|command)$/i.test(w));
    return idx === -1 ? undefined : words.slice(idx + 1).join(' ');
  }
  return undefined;
}

const NODE_LIKE = new Set(['node', 'nodejs', 'bun', 'deno', 'tsx', 'ts-node']);
const REQUIRE_FLAGS = new Set(['-r', '--require', '--import', '--loader', '--experimental-loader']);
const EVAL_FLAGS = new Set(['-e', '--eval', '-p', '--print']);
const CAT_LIKE = new Set(['cat', 'type', 'get-content', 'gc', 'more']);

export type NodeRunVia = 'script' | 'require' | 'stdin';

export interface NodeRun {
  file: string;
  via: NodeRunVia;
}

export interface NodeInvocations {
  runs: NodeRun[];
  /** Inline code passed with `-e`/`-p`. */
  inline: string[];
}

/** Every file a command line hands to Node (or a Node-like runtime). */
export function nodeInvocations(text: string): NodeInvocations {
  const runs: NodeRun[] = [];
  const inline: string[] = [];
  for (const parsed of parseShellDeep(text)) {
    for (const pipeline of parsed.pipelines) {
      pipeline.commands.forEach((cmd, index) => {
        if (!NODE_LIKE.has(programName(cmd.words[0]))) return;
        let script: string | undefined;
        let readsStdin = false;
        let hasEval = false;
        const words = cmd.words;
        let i = 1;
        if (programName(words[0]) === 'deno' || programName(words[0]) === 'bun') {
          if (words[1] === 'run') i = 2;
        }
        for (; i < words.length; i++) {
          const w = words[i]!;
          if (w === '-') {
            readsStdin = true;
            break;
          }
          if (w === '--') {
            script = words[i + 1];
            break;
          }
          if (!w.startsWith('-')) {
            script = w;
            break;
          }
          const eq = w.indexOf('=');
          const flag = eq === -1 ? w : w.slice(0, eq);
          if (REQUIRE_FLAGS.has(flag)) {
            const target = eq === -1 ? words[++i] : w.slice(eq + 1);
            if (target) runs.push({ file: target, via: 'require' });
          } else if (EVAL_FLAGS.has(flag)) {
            const code = eq === -1 ? words[++i] : w.slice(eq + 1);
            if (code !== undefined) inline.push(code);
            hasEval = true;
          }
        }
        if (script) runs.push({ file: script, via: 'script' });
        if ((readsStdin || (!script && !hasEval)) && cmd.stdinFrom) runs.push({ file: cmd.stdinFrom, via: 'stdin' });
        if ((readsStdin || (!script && !hasEval)) && index > 0) {
          const prev = pipeline.commands[index - 1]!;
          if (CAT_LIKE.has(programName(prev.words[0]))) {
            for (const w of prev.words.slice(1)) if (!w.startsWith('-')) runs.push({ file: w, via: 'stdin' });
          }
        }
      });
    }
  }
  return { runs, inline };
}

const DOWNLOADERS = new Set(['curl', 'wget', 'iwr', 'invoke-webrequest', 'irm', 'invoke-restmethod', 'fetch', 'aria2c']);
const INTERPRETERS = new Set([
  ...SHELLS,
  ...POWERSHELLS,
  'cmd',
  'iex',
  'invoke-expression',
  'eval',
  'source',
  '.',
  'node',
  'nodejs',
  'bun',
  'deno',
  'python',
  'python3',
  'perl',
  'ruby',
  'php',
]);

const PS_EXEC = /\b(?:iex|invoke-expression)\b/i;
const PS_DOWNLOAD = /\b(?:downloadstring|downloadfile|downloaddata|iwr|invoke-webrequest|irm|invoke-restmethod|net\.webclient)\b/i;

function containsDownloader(text: string): boolean {
  return parseShell(text).pipelines.some((p) => p.commands.some((c) => DOWNLOADERS.has(programName(c.words[0]))));
}

/**
 * True when a command line fetches something from the network and runs it:
 * `curl … | sh`, `bash <(curl …)`, `sh -c "$(wget -qO- …)"`, PowerShell
 * `iwr … | iex`, or `curl -o x.sh … && sh x.sh`.
 */
export function downloadsAndRuns(text: string): boolean {
  if (PS_EXEC.test(text) && PS_DOWNLOAD.test(text)) return true;
  for (const parsed of parseShellDeep(text)) {
    const downloaded = new Set<string>();
    for (const pipeline of parsed.pipelines) {
      const progs = pipeline.commands.map((c) => programName(c.words[0]));
      const firstDownload = progs.findIndex((p) => DOWNLOADERS.has(p));
      if (firstDownload !== -1 && progs.slice(firstDownload + 1).some((p) => INTERPRETERS.has(p))) return true;
      for (const cmd of pipeline.commands) {
        const prog = programName(cmd.words[0]);
        if (INTERPRETERS.has(prog)) {
          for (const w of cmd.words.slice(1)) {
            if ((w.startsWith('<(') || w.includes('$(')) && containsDownloader(w.replace(/^[<$]\(|\)$/g, ''))) return true;
            if (downloaded.has(w)) return true;
          }
          if (cmd.stdinFrom && downloaded.has(cmd.stdinFrom)) return true;
        }
        if (downloaded.has(cmd.words[0] ?? '') || downloaded.has((cmd.words[0] ?? '').replace(/^\.\//, ''))) return true;
        if (prog === 'curl' || prog === 'wget') {
          cmd.words.forEach((w, i) => {
            if ((w === '-o' || w === '--output' || w === '-O' || w === '--output-document') && cmd.words[i + 1]) {
              const target = cmd.words[i + 1]!;
              downloaded.add(target);
              downloaded.add(target.replace(/^\.\//, ''));
              downloaded.add(`./${target.replace(/^\.\//, '')}`);
            }
          });
        }
      }
    }
  }
  return false;
}
