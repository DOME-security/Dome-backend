/**
 * JSON Schemas for every request and response. Fastify validates requests
 * against them, serializes responses with them, and `openapi.ts` turns them
 * into the committed openapi.json that dome-frontend generates its client from.
 *
 * Report objects set `additionalProperties: true` everywhere: the response
 * serializer drops undeclared fields, and dropping any field of a stored
 * report would break the report hash that is published on chain.
 */

declare module 'fastify' {
  // OpenAPI metadata kept on each route schema; Fastify ignores these keys.
  interface FastifySchema {
    summary?: string;
    description?: string;
    tags?: string[];
  }
}

const SHA256 = '^[0-9a-f]{64}$';

export const errorSchema = {
  type: 'object',
  required: ['error'],
  properties: { error: { type: 'string' } },
} as const;

const severity = { type: 'string', enum: ['info', 'review', 'block'] } as const;
const verdict = { type: 'string', enum: ['clean', 'review', 'block', 'incomplete'] } as const;

const location = {
  type: 'object',
  additionalProperties: true,
  required: ['path'],
  properties: { path: { type: 'string' }, line: { type: 'integer' }, column: { type: 'integer' } },
} as const;

export const reportSchema = {
  type: 'object',
  additionalProperties: true,
  description: 'The full scan report. Reasons are fixed text keyed by rule ID (see packages/engine/rules.json).',
  required: ['tool', 'target', 'scope', 'verdict', 'findings', 'incomplete', 'stats'],
  properties: {
    tool: {
      type: 'object',
      additionalProperties: true,
      required: ['name', 'version'],
      properties: { name: { type: 'string', const: 'dome' }, version: { type: 'string' }, rulesHash: { type: 'string', pattern: SHA256 } },
    },
    target: { type: 'string' },
    scope: { type: 'string', enum: ['full', 'diff'] },
    verdict,
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: true,
        required: ['ruleId', 'relatedRules', 'severity', 'reasonKey', 'reason', 'locations'],
        properties: {
          ruleId: { type: 'string', pattern: '^DOME-[A-Z]{3}-\\d{3}$' },
          relatedRules: { type: 'array', items: { type: 'string' } },
          severity,
          reasonKey: { type: 'string' },
          reason: { type: 'string' },
          locations: { type: 'array', items: location },
          fixture: { type: 'boolean' },
          allowed: { type: 'boolean' },
        },
      },
    },
    incomplete: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: true,
        required: ['path', 'reason'],
        properties: {
          path: { type: 'string' },
          reason: { type: 'string', enum: ['too-large', 'read-error', 'invalid-config', 'unsupported-entry', 'parse-error', 'rule-error'] },
          ruleId: { type: 'string' },
        },
      },
    },
    stats: {
      type: 'object',
      additionalProperties: true,
      properties: { filesInTree: { type: 'integer' }, filesInScope: { type: 'integer' }, rulesRun: { type: 'integer' } },
    },
  },
} as const;

const nullableString = { type: ['string', 'null'] } as const;
const nullableInteger = { type: ['integer', 'null'] } as const;

export const scanSchema = {
  type: 'object',
  required: ['id', 'repository', 'ref', 'commit', 'pullRequest', 'status', 'verdict', 'createdAt', 'startedAt', 'finishedAt', 'attestation'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    repository: {
      type: 'object',
      required: ['owner', 'repo', 'url'],
      properties: { owner: { type: 'string' }, repo: { type: 'string' }, url: { type: 'string' } },
    },
    ref: nullableString,
    commit: nullableString,
    pullRequest: nullableInteger,
    status: { type: 'string', enum: ['queued', 'running', 'done', 'failed'] },
    verdict: { type: ['string', 'null'], enum: ['clean', 'review', 'block', 'incomplete', null] },
    createdAt: { type: 'string', format: 'date-time' },
    startedAt: { type: ['string', 'null'], format: 'date-time' },
    finishedAt: { type: ['string', 'null'], format: 'date-time' },
    error: { type: ['string', 'null'], description: 'Fixed wording; present when status is failed.' },
    report: reportSchema,
    reportHash: { type: 'string', pattern: SHA256, description: 'SHA-256 of the canonical JSON of `report`, as published on chain.' },
    attestation: {
      type: ['object', 'null'],
      required: ['tx'],
      properties: { tx: { type: 'string' } },
      description: 'The registry transaction that published this scan, once it has.',
    },
  },
} as const;

export const createdScanSchema = {
  type: 'object',
  required: ['id', 'status', 'links'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    status: { type: 'string', enum: ['queued', 'running', 'done', 'failed'] },
    links: { type: 'object', required: ['self'], properties: { self: { type: 'string' } } },
  },
} as const;

export const onChainAttestationSchema = {
  type: ['object', 'null'],
  description: 'The newest Dome Registry attestation for the repository, as indexed. A retracted one is still returned, marked retracted.',
  required: ['index', 'commit', 'verdict', 'reportHash', 'rulesHash', 'scanner', 'attester', 'ledger', 'txHash', 'closedAt', 'retracted'],
  properties: {
    index: { type: 'integer' },
    commit: { type: 'string' },
    verdict: { type: 'string', enum: ['clean', 'review', 'block', 'unreadable'] },
    reportHash: nullableString,
    rulesHash: nullableString,
    scanner: nullableInteger,
    attester: { type: 'string' },
    ledger: { type: 'integer' },
    txHash: { type: 'string' },
    closedAt: { type: 'string', format: 'date-time' },
    retracted: { type: 'boolean' },
    retractedBy: nullableString,
    retractReason: nullableString,
  },
} as const;

export const repoSummarySchema = {
  type: 'object',
  required: ['repository', 'latestScan', 'attestation'],
  properties: {
    repository: { type: 'object', required: ['owner', 'repo'], properties: { owner: { type: 'string' }, repo: { type: 'string' } } },
    latestScan: { anyOf: [scanSchema, { type: 'null' }] },
    attestation: onChainAttestationSchema,
  },
} as const;

const evidence = {
  type: 'array',
  items: { type: 'string' },
  description: '`sha256:<hex>` digest of the published advisory and `stellar-tx:<hex>`, the registry transaction behind the current status.',
} as const;

const fileKind = { type: ['string', 'null'], enum: ['task', 'font', 'config', 'script', 'package', null] } as const;

export const indicatorLookupSchema = {
  type: 'object',
  required: ['sha256', 'known'],
  properties: {
    sha256: { type: 'string', pattern: SHA256 },
    known: { type: 'boolean', description: 'True only for indicators the registry curators activated.' },
    campaign: { type: 'string' },
    evidence,
    fileKind,
    ledger: { type: 'integer' },
    txHash: { type: 'string' },
  },
} as const;

export const indicatorPageSchema = {
  type: 'object',
  required: ['indicators', 'nextCursor'],
  properties: {
    indicators: {
      type: 'array',
      items: {
        type: 'object',
        required: ['kind', 'value', 'campaign', 'evidence', 'fileKind'],
        properties: { kind: { type: 'string', const: 'hash' }, value: { type: 'string', pattern: SHA256 }, campaign: { type: 'string' }, evidence, fileKind },
      },
    },
    nextCursor: nullableString,
  },
} as const;
