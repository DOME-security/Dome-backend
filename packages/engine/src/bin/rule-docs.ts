/**
 * Writes docs/rules from rule metadata.
 *   pnpm docs:rules
 */
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { ruleDocFiles } from '../rule-docs.js';

const dir = fileURLToPath(new URL('../../../../docs/rules/', import.meta.url));
await mkdir(dir, { recursive: true });
const files = ruleDocFiles();
for (const existing of await readdir(dir)) {
  if (existing.endsWith('.md') && !(existing in files)) await rm(`${dir}${existing}`);
}
for (const [name, content] of Object.entries(files)) await writeFile(`${dir}${name}`, content);
process.stdout.write(`wrote ${Object.keys(files).length} files to docs/rules\n`);
