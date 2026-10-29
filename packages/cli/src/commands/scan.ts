import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import {
  exitCodeFor,
  formatReport,
  isIndicatorRule,
  REPORT_FORMATS,
  scan,
  sha256Hex,
  type FileSource,
  type ReportFormat,
  type ScanResult,
} from '@dome-security/engine';
import { loadIntel } from '@dome-security/intel';
import { UsageError, type Io } from '../io.js';
import { openTarget } from '../target.js';

export const SCAN_HELP = `Usage: dome scan <path|https-url> [options]

Scans a folder or repository for auto-run files and payloads. Nothing in the
target is executed: files are read as text and bytes only.

Options:
  --diff <base...head>   Only scan what a branch changes (merge-base diff)
  --format <fmt>         text (default), json, sarif or markdown
  --output <file>        Write the report to a file instead of stdout
  --explain              Print file hashes and ready-to-paste .dome.yml allow entries
  --trust-config         Apply the target's .dome.yml fixtures, allow entries and
                         lowered severities. Only for repositories you maintain:
                         without it a repository can raise severities, never lower them.
  --no-intel-cache       Use only the indicators bundled with this release
  --verbose              Include info-level findings in text output
  --no-color             Disable colors

Exit codes: 0 nothing above info, 1 review, 2 block, 3 could not check.
`;

export async function explain(result: ScanResult, source: FileSource): Promise<string> {
  const lines = ['# Hash-pinned exceptions for reviewed findings. Editing a file invalidates its entry.', 'allow:'];
  let any = false;
  for (const f of result.findings) {
    if (isIndicatorRule(f.ruleId) || f.allowed || f.fixture) continue;
    const file = f.locations[0]?.path;
    if (!file) continue;
    const bytes = await source.read(file).catch(() => undefined);
    if (!bytes) continue;
    any = true;
    lines.push(
      `  - rule: ${f.ruleId}`,
      `    file: ${JSON.stringify(file)}`,
      `    sha256: "${sha256Hex(bytes)}"`,
      '    reason: "<who reviewed this and why it is safe>"',
    );
  }
  await source.close?.();
  return any ? `${lines.join('\n')}\n` : '# Nothing to allow: no reviewable findings.\n';
}

export async function runScan(args: string[], io: Io): Promise<number> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      diff: { type: 'string' },
      format: { type: 'string', default: 'text' },
      output: { type: 'string' },
      explain: { type: 'boolean', default: false },
      'trust-config': { type: 'boolean', default: false },
      'no-intel-cache': { type: 'boolean', default: false },
      verbose: { type: 'boolean', default: false },
      'no-color': { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });
  if (values.help) {
    io.stdout(SCAN_HELP);
    return 0;
  }
  if (positionals.length !== 1) throw new UsageError('dome scan takes exactly one path or URL');
  const format = values.format as ReportFormat;
  if (!REPORT_FORMATS.includes(format)) throw new UsageError(`unknown --format: ${values.format}`);

  const intel = await loadIntel({ useCache: !values['no-intel-cache'] });
  const target = await openTarget(positionals[0]!, io.cwd, values.diff);
  try {
    const result = await scan({
      source: target.source,
      diff: target.diff,
      intel,
      repoConfig: values['trust-config'] ? 'trusted' : 'untrusted',
    });
    const color = io.isTty && !values['no-color'] && !values.output && !io.env.NO_COLOR;
    const report = formatReport(result, format, { color, verbose: values.verbose });
    if (values.output) {
      await writeFile(path.resolve(io.cwd, values.output), report);
      io.stderr(`dome: ${result.verdict} (${result.findings.length} findings) written to ${values.output}\n`);
    } else {
      io.stdout(report);
    }
    if (values.explain) {
      const text = await explain(result, target.source);
      if (format === 'text' && !values.output) io.stdout(`\n${text}`);
      else io.stderr(text);
    }
    return exitCodeFor(result.verdict);
  } finally {
    await target.dispose();
  }
}
