import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildOpenApi, openApiJson } from './openapi.js';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version: string };

describe('openapi.json', () => {
  it('is up to date with the route schemas (run pnpm openapi)', async () => {
    expect(readFileSync(new URL('../../../openapi.json', import.meta.url), 'utf8')).toBe(await openApiJson(pkg.version));
  });

  it('describes every public route with typed parameters and responses', async () => {
    const doc = (await buildOpenApi(pkg.version)) as { paths: Record<string, Record<string, { responses: object; parameters: { name: string; in: string }[] }>> };
    expect(Object.keys(doc.paths)).toEqual(
      expect.arrayContaining(['/healthz', '/v1/scans', '/v1/scans/{id}', '/v1/repos/{owner}/{repo}', '/v1/webhooks/github']),
    );
    expect(doc.paths['/v1/scans/{id}']!.get!.parameters).toEqual([expect.objectContaining({ name: 'id', in: 'path', required: true })]);
    for (const ops of Object.values(doc.paths)) {
      for (const op of Object.values(ops)) expect(Object.keys(op.responses).length).toBeGreaterThan(0);
    }
  });
});
