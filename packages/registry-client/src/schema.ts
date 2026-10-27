/**
 * The Dome Registry contract interface as this client expects it. This file
 * is the single place that mirrors `dome-contracts`; when that repository
 * publishes generated TypeScript bindings, replace the hand-written encoding
 * here with them and keep the types below as the stable surface.
 *
 * Events (topic[0] is a Symbol):
 *   attest  { repo: String, commit: String, verdict: Symbol, report_hash: BytesN<32>, attester: Address }
 *   approve { kind: Symbol, value: String, campaign: String, evidence: Vec<String> }
 *   revoke  { kind: Symbol, value: String }
 *
 * Functions:
 *   attest(attester: Address, repo: String, commit: String, verdict: Symbol, report_hash: BytesN<32>)
 */

export type IndicatorKind = 'hash' | 'marker' | 'package' | 'domain';
export type AttestedVerdict = 'clean' | 'review' | 'block';

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
  /** `owner/repo` on GitHub. */
  repo: string;
  commit: string;
  verdict: AttestedVerdict;
  /** Lowercase hex SHA-256 of the canonical JSON report. */
  reportHash: string;
  attester: string;
}

export interface ApproveEvent extends EventMeta {
  type: 'approve';
  kind: IndicatorKind;
  value: string;
  campaign: string;
  evidence: string[];
}

export interface RevokeEvent extends EventMeta {
  type: 'revoke';
  kind: IndicatorKind;
  value: string;
}

export type RegistryEvent = AttestEvent | ApproveEvent | RevokeEvent;

export const INDICATOR_KINDS: readonly IndicatorKind[] = ['hash', 'marker', 'package', 'domain'];
export const ATTESTED_VERDICTS: readonly AttestedVerdict[] = ['clean', 'review', 'block'];

export interface Attestation {
  repo: string;
  commit: string;
  verdict: AttestedVerdict;
  reportHash: string;
}
