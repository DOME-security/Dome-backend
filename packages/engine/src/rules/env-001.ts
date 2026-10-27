import { tokenize, usesNetwork, wholeProcessEnv } from '../parsers/js.js';
import { basename, isJsLike } from '../parsers/text.js';
import type { Location } from '../types.js';
import { defineRule, targetsWhere } from './rule.js';
import { isTestPath, REFS } from './shared.js';

const ENV_FILE = /^\.env(?:\..+)?$/;
const BASE64 = /^[A-Za-z0-9+/]{16,}={0,2}$/;

function encodedUrl(value: string): boolean {
  const v = value.trim().replace(/^["']|["']$/g, '');
  if (!BASE64.test(v) || !v.startsWith('aHR0c')) return false;
  return /^https?:\/\//.test(Buffer.from(v, 'base64').toString('latin1'));
}

export default defineRule(
  {
    id: 'DOME-ENV-001',
    title: 'Encoded URL in .env with code that sends the environment',
    category: 'payload',
    severity: 'review',
    summary: 'Base64-encoded URLs in `.env` files combined with code that sends `process.env` over the network.',
    reasons: {
      encodedUrl: 'An environment file stores a URL encoded as base64.',
      envSent: 'Code sends the whole process environment over the network.',
    },
    doc: {
      why: 'The malicious Next.js repositories Microsoft describes keep their C2 address base64-encoded in `.env` and add a backend route that posts the entire `process.env` (API keys, wallet keys, tokens) to it. Each half alone is a review; together they block.',
      falsePositives: 'Telemetry or crash reporters that send a full environment. That is a privacy problem in itself.',
      references: [REFS.microsoftNext],
    },
  },
  async (ctx) => {
    const encoded: Location[] = [];
    const senders: Location[] = [];
    for (const { path } of targetsWhere(ctx, (p) => ENV_FILE.test(basename(p)))) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      text.split(/\r?\n/).forEach((line, i) => {
        const eq = line.indexOf('=');
        if (eq !== -1 && !line.trimStart().startsWith('#') && encodedUrl(line.slice(eq + 1))) encoded.push({ path, line: i + 1 });
      });
    }
    for (const { path } of targetsWhere(ctx, (p) => isJsLike(p) && !isTestPath(p) && !p.includes('node_modules/'))) {
      const text = await ctx.readText(path);
      if (text === undefined || !text.includes('process')) continue;
      const tokens = tokenize(text);
      const whole = wholeProcessEnv(tokens);
      if (whole.length > 0 && usesNetwork(tokens)) senders.push(ctx.locate(path, whole[0]!));
    }
    const both = encoded.length > 0 && senders.length > 0;
    for (const loc of encoded) ctx.report('encodedUrl', both ? [loc, ...senders] : loc, both ? 'block' : 'review');
    if (!both) for (const loc of senders) ctx.report('envSent', loc);
  },
);
