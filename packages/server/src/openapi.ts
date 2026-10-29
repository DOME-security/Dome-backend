/**
 * Builds the OpenAPI 3.1 document from the route schemas the server already
 * validates against, so the spec cannot drift from the behaviour.
 *   pnpm openapi   (writes openapi.json at the repository root)
 */
import type { RouteOptions } from 'fastify';
import { buildApp } from './app.js';
import { errorSchema } from './schemas.js';
import { MemoryStore } from './store/memory.js';

type Json = Record<string, unknown>;

interface ObjectSchema {
  properties?: Record<string, Json>;
  required?: string[];
}

const STATUS_TEXT: Record<string, string> = {
  '200': 'OK',
  '202': 'Accepted',
  '400': 'Invalid request',
  '401': 'Unauthorized',
  '404': 'Not found',
  '429': 'Rate limit exceeded',
  '503': 'Not configured',
};

function parameters(where: 'path' | 'query', schema: unknown): Json[] {
  const { properties = {}, required = [] } = (schema ?? {}) as ObjectSchema;
  return Object.entries(properties).map(([name, s]) => ({
    name,
    in: where,
    required: where === 'path' || required.includes(name),
    schema: s,
  }));
}

function operation(route: RouteOptions): Json {
  const schema = (route.schema ?? {}) as Json;
  const responses: Json = {};
  for (const [status, body] of Object.entries((schema.response ?? {}) as Json)) {
    responses[status] = {
      description: STATUS_TEXT[status] ?? 'Response',
      content: { 'application/json': { schema: body } },
    };
  }
  const limited = Boolean((route.config as { rateLimit?: unknown } | undefined)?.rateLimit);
  if (limited && !responses['429']) {
    responses['429'] = { description: STATUS_TEXT['429'], content: { 'application/json': { schema: errorSchema } } };
  }
  const op: Json = {
    summary: schema.summary,
    ...(schema.description ? { description: schema.description } : {}),
    tags: schema.tags ?? [],
    parameters: [...parameters('path', schema.params), ...parameters('query', schema.querystring)],
    responses,
  };
  if (schema.body) op.requestBody = { required: true, content: { 'application/json': { schema: schema.body } } };
  return op;
}

/** `/v1/scans/:id` becomes `/v1/scans/{id}`. */
const openApiPath = (url: string) => url.replace(/:([A-Za-z0-9_]+)/g, '{$1}');

export async function buildOpenApi(version: string): Promise<Json> {
  const routes: RouteOptions[] = [];
  const app = await buildApp({ store: new MemoryStore(), onRoute: (r) => routes.push(r) });
  await app.ready();
  await app.close();

  const paths: Record<string, Json> = {};
  for (const route of routes) {
    for (const method of [route.method].flat()) {
      if (method === 'HEAD' || method === 'OPTIONS') continue;
      (paths[openApiPath(route.url)] ??= {})[method.toLowerCase()] = operation(route);
    }
  }
  const sorted = Object.fromEntries(Object.entries(paths).sort(([a], [b]) => a.localeCompare(b)));
  return {
    openapi: '3.1.0',
    info: {
      title: 'Dome API',
      version,
      description: 'Scan queue, scan results, repository summaries and the indicator feed. Generated from the server route schemas.',
      license: { name: 'Apache-2.0', identifier: 'Apache-2.0' },
    },
    paths: sorted,
  };
}

export async function openApiJson(version: string): Promise<string> {
  return `${JSON.stringify(await buildOpenApi(version), null, 2)}\n`;
}
