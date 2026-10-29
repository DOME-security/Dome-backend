import type { ContractEvent } from '@dome-security/registry-bindings';
import type { xdr } from '@stellar/stellar-sdk';
import {
  INDICATOR_FILE_KINDS,
  REGISTRY_VERDICTS,
  type EventMeta,
  type IndicatorFileKind,
  type RegistryEvent,
  type RegistryVerdict,
} from './schema.js';

export interface RawContractEvent extends EventMeta {
  topic: xdr.ScVal[];
  value: xdr.ScVal;
}

/** The generated bindings' event parser (`Client.parseEvent`). */
export type EventParser = (topics: xdr.ScVal[], data: xdr.ScVal) => ContractEvent | undefined;

const ACCOUNT = /^[GC][A-Z2-7]{55}$/;
const CAMPAIGN = /^[A-Za-z0-9_]{1,32}$/; // a Soroban Symbol

function bytes(v: unknown, lengths: readonly number[]): string | undefined {
  if (!(v instanceof Uint8Array) || !lengths.includes(v.length)) return undefined;
  return Buffer.from(v).toString('hex');
}

function account(v: unknown): string | undefined {
  return typeof v === 'string' && ACCOUNT.test(v) ? v : undefined;
}

function u32(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 0xffffffff ? v : undefined;
}

function oneOf<T extends string>(v: unknown, values: readonly T[]): T | undefined {
  return typeof v === 'string' && (values as readonly string[]).includes(v) ? (v as T) : undefined;
}

/**
 * Decodes one contract event with the generated bindings and validates every
 * field. Events this backend does not use (roles, admin, threshold,
 * upgrades) and events that do not match the schema return undefined rather
 * than being trusted partially.
 */
export function decodeEvent(parse: EventParser, raw: RawContractEvent): RegistryEvent | undefined {
  let event: ContractEvent | undefined;
  try {
    event = parse(raw.topic, raw.value);
  } catch {
    return undefined;
  }
  if (!event || !/^[0-9a-f]{64}$/.test(raw.txHash)) return undefined;
  const meta: EventMeta = { id: raw.id, ledger: raw.ledger, txHash: raw.txHash, contractId: raw.contractId, closedAt: raw.closedAt };
  const d = event.data as Record<string, unknown>;

  switch (event.name) {
    case 'Attested': {
      const repoId = bytes(d.repo, [32]);
      const verdict = oneOf<RegistryVerdict>(d.verdict, REGISTRY_VERDICTS);
      const commit = bytes(d.commit, [20, 32]);
      const attester = account(d.attester);
      const index = u32(d.index);
      if (!repoId || !verdict || !commit || !attester || index === undefined) return undefined;
      return { ...meta, type: 'attest', repoId, verdict, commit, attester, index };
    }
    case 'AttestationRetracted': {
      const repoId = bytes(d.repo, [32]);
      const index = u32(d.index);
      const by = account(d.by);
      const reason = bytes(d.reason, [32]);
      if (!repoId || index === undefined || !by || !reason) return undefined;
      return { ...meta, type: 'retract_attest', repoId, index, by, reason };
    }
    case 'Proposed': {
      const hash = bytes(d.hash, [32]);
      const fileKind = oneOf<IndicatorFileKind>(d.kind, INDICATOR_FILE_KINDS);
      const campaign = typeof d.campaign === 'string' && CAMPAIGN.test(d.campaign) ? d.campaign : undefined;
      const evidence = bytes(d.evidence, [32]);
      const curator = account(d.curator);
      if (!hash || !fileKind || !campaign || !evidence || !curator) return undefined;
      return { ...meta, type: 'propose', hash, fileKind, campaign, evidence, curator };
    }
    case 'Approved': {
      const hash = bytes(d.hash, [32]);
      const curator = account(d.curator);
      const approvals = u32(d.approvals);
      const status = oneOf(d.status, ['proposed', 'active'] as const);
      if (!hash || !curator || approvals === undefined || !status) return undefined;
      return { ...meta, type: 'approve', hash, curator, approvals, status };
    }
    case 'Retracted': {
      const hash = bytes(d.hash, [32]);
      const curator = account(d.curator);
      const reason = bytes(d.reason, [32]);
      if (!hash || !curator || !reason) return undefined;
      return { ...meta, type: 'retract', hash, curator, reason };
    }
    default:
      return undefined;
  }
}
