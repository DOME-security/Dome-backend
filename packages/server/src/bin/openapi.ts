/** Writes openapi.json at the repository root.  pnpm openapi */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { openApiJson } from '../openapi.js';

const pkg = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8')) as { version: string };
await writeFile(fileURLToPath(new URL('../../../../openapi.json', import.meta.url)), await openApiJson(pkg.version));
process.stdout.write('wrote openapi.json\n');
