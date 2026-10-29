import { Client as Bindings } from '@dome-security/registry-bindings';
import { Account, BASE_FEE, Contract, contract, Keypair, rpc, TransactionBuilder, xdr } from '@stellar/stellar-sdk';
import { decodeEvent, type RawContractEvent } from './decode.js';
import {
  isHex64,
  REGISTRY_VERDICTS,
  repoIdOf,
  type Attestation,
  type OnChainAttestation,
  type RegistryEvent,
  type RegistryVerdict,
} from './schema.js';

export interface RegistryClientOptions {
  rpcUrl: string;
  contractId: string;
  networkPassphrase: string;
  /** Allow plain-http RPC endpoints (local development only). */
  allowHttp?: boolean;
}

type GetEventsRequest = Parameters<rpc.Server['getEvents']>[0];
type Transaction = ReturnType<TransactionBuilder['build']>;

export interface EventPage {
  events: RegistryEvent[];
  /** Pass back to continue after the last event returned. */
  cursor: string | undefined;
  latestLedger: number;
}

/** The subset of the Stellar RPC server this client uses; injectable for tests. */
export interface RpcLike {
  getEvents(request: GetEventsRequest): Promise<rpc.Api.GetEventsResponse>;
  getAccount(address: string): Promise<Account>;
  simulateTransaction(tx: Transaction): Promise<rpc.Api.SimulateTransactionResponse>;
  prepareTransaction(tx: Transaction): Promise<Transaction>;
  sendTransaction(tx: Transaction): Promise<rpc.Api.SendTransactionResponse>;
  getTransaction(hash: string): Promise<rpc.Api.GetTransactionResponse>;
}

export class RegistryError extends Error {
  override name = 'RegistryError';
}

const SHA1 = /^[0-9a-f]{40}$/;

/**
 * Reads Dome Registry events and attestations and publishes attestations.
 * Arguments are encoded and events decoded with the contract spec from the
 * generated bindings, so they always match the deployed interface.
 */
export class RegistryClient {
  private readonly rpc: RpcLike;
  private readonly contract: Contract;
  private readonly bindings: Bindings;

  constructor(
    private readonly options: RegistryClientOptions,
    rpcImpl?: RpcLike,
  ) {
    this.rpc = rpcImpl ?? new rpc.Server(options.rpcUrl, { allowHttp: options.allowHttp ?? false });
    this.contract = new Contract(options.contractId);
    this.bindings = new Bindings({
      contractId: options.contractId,
      networkPassphrase: options.networkPassphrase,
      rpcUrl: options.rpcUrl,
      allowHttp: options.allowHttp ?? false,
    });
  }

  /**
   * Reads registry events, starting at `startLedger` the first time and at
   * `cursor` afterwards. Events from other contracts, events this backend
   * does not use, and events that do not decode are dropped.
   */
  async events(position: { startLedger: number } | { cursor: string }, limit = 200): Promise<EventPage> {
    const filters = [{ type: 'contract' as const, contractIds: [this.options.contractId] }];
    const request = (
      'cursor' in position ? { filters, cursor: position.cursor, limit } : { filters, startLedger: position.startLedger, limit }
    ) as GetEventsRequest;
    const res = await this.rpc.getEvents(request);
    const parse = (topics: xdr.ScVal[], data: xdr.ScVal) => this.bindings.parseEvent(topics, data);
    const events: RegistryEvent[] = [];
    for (const e of res.events) {
      const contractId = e.contractId?.contractId();
      // The RPC filter asks for this contract only; do not take its word for it.
      if (contractId !== this.options.contractId) continue;
      const raw: RawContractEvent = {
        id: e.id,
        ledger: e.ledger,
        txHash: e.txHash,
        contractId,
        closedAt: e.ledgerClosedAt,
        topic: e.topic,
        value: e.value,
      };
      const decoded = decodeEvent(parse, raw);
      if (decoded) events.push(decoded);
    }
    const cursor = (res as { cursor?: string }).cursor ?? res.events.at(-1)?.id;
    return { events, cursor, latestLedger: res.latestLedger };
  }

  /** Arguments for the contract's `attest(attester, a: AttestationInput)`. */
  attestArgs(attester: string, a: Attestation): xdr.ScVal[] {
    if (!SHA1.test(a.commit)) throw new RegistryError('commit must be a 40-character hex SHA-1');
    if (!REGISTRY_VERDICTS.includes(a.verdict)) throw new RegistryError('verdict is not one the registry accepts');
    if (!Number.isInteger(a.scanner) || a.scanner <= 0 || a.scanner > 0xffffffff) throw new RegistryError('scanner must be a non-zero u32');
    if (!isHex64(a.rulesHash) || !isHex64(a.reportHash)) throw new RegistryError('rulesHash and reportHash must be SHA-256 hex digests');
    return this.bindings.spec.funcArgsToScVals('attest', {
      attester,
      a: {
        repo: Buffer.from(repoIdOf(a.owner, a.repo), 'hex'),
        commit: Buffer.from(a.commit, 'hex'),
        verdict: a.verdict,
        scanner: a.scanner,
        rules: Buffer.from(a.rulesHash, 'hex'),
        report: Buffer.from(a.reportHash, 'hex'),
      },
    });
  }

  /** Publishes an attestation signed by `signer` and waits for it to land. Returns the transaction hash. */
  async attest(signer: Keypair, attestation: Attestation, timeoutMs = 60_000): Promise<string> {
    const account = await this.rpc.getAccount(signer.publicKey());
    const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase: this.options.networkPassphrase })
      .addOperation(this.contract.call('attest', ...this.attestArgs(signer.publicKey(), attestation)))
      .setTimeout(30)
      .build();
    const prepared = await this.rpc.prepareTransaction(tx);
    prepared.sign(signer);
    const sent = await this.rpc.sendTransaction(prepared);
    if (sent.status === 'ERROR') throw new RegistryError('the network rejected the attestation transaction');
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const status = await this.rpc.getTransaction(sent.hash);
      if (status.status === rpc.Api.GetTransactionStatus.SUCCESS) return sent.hash;
      if (status.status === rpc.Api.GetTransactionStatus.FAILED) throw new RegistryError('the attestation transaction failed');
      await new Promise((r) => setTimeout(r, 1000));
    }
    throw new RegistryError('timed out waiting for the attestation transaction');
  }

  /**
   * Reads one attestation with a simulated (free, unsigned) `history` call.
   * Events carry only part of an attestation; this returns the stored record
   * with its report and rule-set hashes.
   */
  async readAttestation(repoId: string, index: number): Promise<OnChainAttestation | undefined> {
    if (!isHex64(repoId)) throw new RegistryError('repoId must be a SHA-256 hex digest');
    const args = this.bindings.spec.funcArgsToScVals('history', { repo: Buffer.from(repoId, 'hex'), start: index, limit: 1 });
    const tx = new TransactionBuilder(new Account(contract.NULL_ACCOUNT, '0'), {
      fee: BASE_FEE,
      networkPassphrase: this.options.networkPassphrase,
    })
      .addOperation(this.contract.call('history', ...args))
      .setTimeout(30)
      .build();
    const sim = await this.rpc.simulateTransaction(tx);
    if (!rpc.Api.isSimulationSuccess(sim) || !sim.result) throw new RegistryError('could not read the attestation');
    const result = this.bindings.spec.funcResToNative('history', sim.result.retval) as contract.Result<unknown[]>;
    if (result.isErr()) return undefined;
    const [stored] = result.unwrap();
    return stored === undefined ? undefined : toOnChain(repoId, index, stored);
  }
}

function hex(v: unknown, lengths: readonly number[]): string {
  if (!(v instanceof Uint8Array) || !lengths.includes(v.length)) throw new RegistryError('unexpected attestation field');
  return Buffer.from(v).toString('hex');
}

function toOnChain(repoId: string, index: number, raw: unknown): OnChainAttestation {
  const a = raw as Record<string, unknown>;
  if (hex(a.repo, [32]) !== repoId) throw new RegistryError('the registry returned an attestation for another repository');
  const verdict = a.verdict as RegistryVerdict;
  if (!REGISTRY_VERDICTS.includes(verdict)) throw new RegistryError('unexpected attestation verdict');
  if (typeof a.attester !== 'string' || typeof a.scanner !== 'number' || typeof a.at !== 'bigint') {
    throw new RegistryError('unexpected attestation fields');
  }
  return {
    repoId,
    index,
    commit: hex(a.commit, [20, 32]),
    verdict,
    scanner: a.scanner,
    rulesHash: hex(a.rules, [32]),
    reportHash: hex(a.report, [32]),
    attester: a.attester,
    at: Number(a.at),
    retractedBy: typeof a.retracted_by === 'string' ? a.retracted_by : null,
    retractReason: a.retract_reason instanceof Uint8Array ? hex(a.retract_reason, [32]) : null,
  };
}
