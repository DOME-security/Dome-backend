/** After `changeset version`: keeps files derived from package versions in step. */
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const { version } = JSON.parse(await readFile(new URL('packages/engine/package.json', root), 'utf8')) as { version: string };
const file = new URL('packages/engine/src/version.ts', root);
const text = await readFile(file, 'utf8');
await writeFile(file, text.replace(/VERSION = '[^']*'/, `VERSION = '${version}'`));
process.stdout.write(`engine VERSION is ${version}\n`);
