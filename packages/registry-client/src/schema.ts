/**
 * The Dome Registry as this backend uses it. Encoding and decoding go
 * through the generated bindings vendored from dome-contracts
 * (`vendor/registry-bindings`); the types here are the stable surface the
 * server, workers and indexer depend on.
 *
 * Contract (dome-contracts `contracts/registry`):
 *   attest(attester: Address, a: AttestationInput) -> u32
 *     AttestationInput { repo: BytesN<32>, commit: Bytes, verdict: Symbol,
 *                        scanner: u32, rules: BytesN<32>, report: BytesN<32> }
 *   history(repo: BytesN<32>, start: u32, limit: u32) -> Vec<Attestation>
 *
 * Events (first topic is the event name):
 *   attest          topics: repo, verdict   data: commit, attester, index
 *   retract_attest  topics: repo            data: index, by, reason
 *   propose         topics: hash            data: kind, campaign, evidence, curator
 *   approve         topics: hash            data: curator, approvals, status
 *   retract         topics: hash            data: curator, reason
 */
import { createHash } from 'node:crypto';

export type RegistryVerdict = 'clean' | 'review' | 'block' | 'unreadable';
export const REGISTRY_VERDICTS: readonly RegistryVerdict[] = ['clean', 'review', 'block', 'unreadable'];

/** What kind of file an indicator fingerprints. */
export type IndicatorFileKind = 'task' | 'font' | 'config' | 'script' | 'package';
export const INDICATOR_FILE_KINDS: readonly IndicatorFileKind[] = ['task', 'font', 'config', 'script', 'package'];

export type IndicatorStatus = 'proposed' | 'active' | 'retracted';

export interface EventMeta {
  /** Stellar RPC event id; unique and ordered. */
  id: string;
  ledger: number;
  txHash: string;
  contractId: string;
  closedAt: string;
}

export interface AttestEvent extends EventMeta {
  type: 'attest';
  /** Lowercase hex SHA-256 of the normalized repo id (see `repoIdOf`). */
  repoId: string;
  verdict: RegistryVerdict;
  /** Lowercase hex git commit id. */
  commit: string;
  attester: string;
  /** Position in the repository's attestation history. */
  index: number;
}

export interface AttestRetractEvent extends EventMeta {
  type: 'retract_attest';
  repoId: string;
  index: number;
  by: string;
  /** Hex SHA-256 of the public retraction notice. */
  reason: string;
}

export interface ProposeEvent extends EventMeta {
  type: 'propose';
  /** Hex SHA-256 of the malicious file. */
  hash: string;
  fileKind: IndicatorFileKind;
  campaign: string;
  /** Hex SHA-256 of the public write-up or advisory. */
  evidence: string;
  curator: string;
}

export interface ApproveEvent extends EventMeta {
  type: 'approve';
  hash: string;
  curator: string;
  approvals: number;
  /** `active` once the approval threshold is reached. */
  status: 'proposed' | 'active';
}

export interface RetractEvent extends EventMeta {
  type: 'retract';
  hash: string;
  curator: string;
  reason: string;
}

export type RegistryEvent = AttestEvent | AttestRetractEvent | ProposeEvent | ApproveEvent | RetractEvent;

/** A scan result to publish with `attest`. */
export interface Attestation {
  owner: string;
  repo: string;
  /** 40-character hex SHA-1 commit id. */
  commit: string;
  verdict: RegistryVerdict;
  /** Engine version as a number (see `scannerVersion`). */
  scanner: number;
  /** Hex SHA-256 of the rule and indicator set used. */
  rulesHash: string;
  /** Hex SHA-256 of the canonical JSON report. */
  reportHash: string;
}

/** An attestation as stored on chain, read with `history`. */
export interface OnChainAttestation {
  repoId: string;
  index: number;
  commit: string;
  verdict: RegistryVerdict;
  scanner: number;
  rulesHash: string;
  reportHash: string;
  attester: string;
  /** Ledger timestamp of the write, in seconds. */
  at: number;
  retractedBy: string | null;
  retractReason: string | null;
}

const HEX64 = /^[0-9a-f]{64}$/;
const OWNER = /^[A-Za-z0-9-]{1,39}$/;
const REPO = /^[A-Za-z0-9._-]{1,100}$/;

/**
 * The registry's repository id: SHA-256 of `github.com/<owner>/<repo>`,
 * lowercased (GitHub names are case-insensitive) and without `.git`. The
 * same convention is used by dome-frontend to look a repository up.
 */
export function repoIdOf(owner: string, repo: string): string {
  if (!OWNER.test(owner) || !REPO.test(repo) || repo === '.' || repo === '..') throw new RangeError('invalid GitHub repository name');
  return createHash('sha256').update(`github.com/${owner}/${repo}`.toLowerCase()).digest('hex');
}

/**
 * Encodes a semver engine version as the contract's non-zero `scanner` u32:
 * major * 1_000_000 + minor * 1_000 + patch (so 0.1.0 is 1000).
 */
export function scannerVersion(version: string): number {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?:[-+].*)?$/.exec(version);
  if (!m) throw new RangeError(`not a semver version: ${version}`);
  const n = Number(m[1]) * 1_000_000 + Number(m[2]) * 1_000 + Number(m[3]);
  if (n === 0 || n > 0xffffffff) throw new RangeError(`scanner version out of range: ${version}`);
  return n;
}

export function isHex64(value: string): boolean {
  return HEX64.test(value);
}
