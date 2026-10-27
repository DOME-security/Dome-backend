import { VERSION } from '@dome-security/engine';
import { runInit } from './commands/init.js';
import { runIntel } from './commands/intel.js';
import { runScan } from './commands/scan.js';
import { runSweep } from './commands/sweep.js';
import { UsageError, type Io } from './io.js';

export { processIo, type Io } from './io.js';

export const HELP = `dome ${VERSION}: find code a repository will run without asking

Usage:
  dome scan <path|https-url> [--diff base...head] [--format text|json|sarif|markdown]
  dome sweep <folder>
  dome intel <update|status>
  dome init [--write]

Run "dome <command> --help" for details. Dome reads files as text and bytes.
It never executes them.
`;

const COMMANDS: Record<string, (args: string[], io: Io) => Promise<number>> = {
  scan: runScan,
  sweep: runSweep,
  intel: runIntel,
  init: runInit,
};

/** Runs the CLI and returns the process exit code. */
export async function main(argv: string[], io: Io): Promise<number> {
  const [command, ...rest] = argv;
  if (!command || command === '--help' || command === '-h' || command === 'help') {
    io.stdout(HELP);
    return command ? 0 : 64;
  }
  if (command === '--version' || command === '-v') {
    io.stdout(`${VERSION}\n`);
    return 0;
  }
  const run = COMMANDS[command];
  try {
    if (!run) throw new UsageError(`unknown command: ${command}`);
    return await run(rest, io);
  } catch (error) {
    if (error instanceof UsageError || (error as { code?: string }).code?.startsWith('ERR_PARSE_ARGS')) {
      io.stderr(`dome: ${(error as Error).message}\n`);
      return 64;
    }
    io.stderr(`dome: ${(error as Error).message}\n`);
    // A scan that fails is never "clean".
    return 3;
  }
}
