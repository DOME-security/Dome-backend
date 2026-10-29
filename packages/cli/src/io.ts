export interface Io {
  stdout(text: string): void;
  stderr(text: string): void;
  cwd: string;
  env: NodeJS.ProcessEnv;
  /** Whether stdout is an interactive terminal (for colors). */
  isTty: boolean;
  /** Replaces the global fetch; tests use it to observe every request a command makes. */
  fetch?: typeof fetch;
}

export class UsageError extends Error {
  override name = 'UsageError';
}

export function processIo(): Io {
  return {
    stdout: (t) => process.stdout.write(t),
    stderr: (t) => process.stderr.write(t),
    cwd: process.cwd(),
    env: process.env,
    isTty: Boolean(process.stdout.isTTY),
  };
}
