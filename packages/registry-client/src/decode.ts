import { scValToNative, xdr } from '@stellar/stellar-sdk';
import {
  ATTESTED_VERDICTS,
  INDICATOR_KINDS,
  type AttestedVerdict,
  type EventMeta,
  type IndicatorKind,
  type RegistryEvent,
} from './schema.js';

export interface RawContractEvent extends EventMeta {
  topic: xdr.ScVal[];
  value: xdr.ScVal;
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

function hex(v: unknown): string | undefined {
  if (v instanceof Uint8Array) return Buffer.from(v).toString('hex');
  return undefined;
}

/**
 * Decodes one contract event. Events that do not match the expected schema
 * are skipped (returned as undefined) rather than trusted partially.
 */
export function decodeEvent(raw: RawContractEvent): RegistryEvent | undefined {
  const [first] = raw.topic;
  if (!first) return undefined;
  let name: unknown;
  let body: unknown;
  try {
    name = scValToNative(first);
    body = scValToNative(raw.value);
  } catch {
    return undefined;
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return undefined;
  const v = body as Record<string, unknown>;
  const meta: EventMeta = { id: raw.id, ledger: raw.ledger, txHash: raw.txHash, contractId: raw.contractId, closedAt: raw.closedAt };

  if (name === 'attest') {
    const repo = str(v.repo);
    const commit = str(v.commit);
    const verdict = str(v.verdict);
    const reportHash = hex(v.report_hash);
    const attester = str(v.attester);
    if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo) || !commit || !/^[0-9a-f]{40}$/.test(commit)) return undefined;
    if (!verdict || !ATTESTED_VERDICTS.includes(verdict as AttestedVerdict) || !reportHash || reportHash.length !== 64 || !attester) {
      return undefined;
    }
    return { ...meta, type: 'attest', repo, commit, verdict: verdict as AttestedVerdict, reportHash, attester };
  }
  if (name === 'approve' || name === 'revoke') {
    const kind = str(v.kind);
    const value = str(v.value);
    if (!kind || !INDICATOR_KINDS.includes(kind as IndicatorKind) || !value) return undefined;
    if (name === 'revoke') return { ...meta, type: 'revoke', kind: kind as IndicatorKind, value };
    const campaign = str(v.campaign);
    const evidence = Array.isArray(v.evidence) ? v.evidence.filter((e): e is string => typeof e === 'string') : [];
    if (!campaign) return undefined;
    return { ...meta, type: 'approve', kind: kind as IndicatorKind, value, campaign, evidence };
  }
  return undefined;
}
