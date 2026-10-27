import { Address, BASE_FEE, Contract, Keypair, nativeToScVal, rpc, TransactionBuilder, xdr } from '@stellar/stellar-sdk';
import { decodeEvent, type RawContractEvent } from './decode.js';
import type { Attestation, RegistryEvent } from './schema.js';

export interface RegistryClientOptions {
  rpcUrl: string;
  contractId: string;
  networkPassphrase: string;
  /** Allow plain-http RPC endpoints (local development only). */
  allowHttp?: boolean;
}

type GetEventsRequest = Parameters<rpc.Server['getEvents']>[0];

export interface EventPage {
  events: RegistryEvent[];
  /** Pass back to continue after the last event returned. */
  cursor: string | undefined;
  latestLedger: number;
}

/** The subset of the Stellar RPC server this client uses; injectable for tests. */
export interface RpcLike {
  getEvents(request: GetEventsRequest): Promise<rpc.Api.GetEventsResponse>;
  getAccount(address: string): Promise<import('@stellar/stellar-sdk').Account>;
  prepareTransaction(tx: import('@stellar/stellar-sdk').Transaction): Promise<import('@stellar/stellar-sdk').Transaction>;
  sendTransaction(tx: import('@stellar/stellar-sdk').Transaction): Promise<rpc.Api.SendTransactionResponse>;
  getTransaction(hash: string): Promise<rpc.Api.GetTransactionResponse>;
}

export class RegistryError extends Error {
  override name = 'RegistryError';
}

export class RegistryClient {
  private readonly rpc: RpcLike;
  private readonly contract: Contract;

  constructor(
    private readonly options: RegistryClientOptions,
    rpcImpl?: RpcLike,
  ) {
    this.rpc = rpcImpl ?? new rpc.Server(options.rpcUrl, { allowHttp: options.allowHttp ?? false });
    this.contract = new Contract(options.contractId);
  }

  /**
   * Reads registry events, starting at `startLedger` the first time and at
   * `cursor` afterwards. Events that do not decode are dropped.
   */
  async events(position: { startLedger: number } | { cursor: string }, limit = 200): Promise<EventPage> {
    const filters = [{ type: 'contract' as const, contractIds: [this.options.contractId] }];
    const request = (
      'cursor' in position ? { filters, cursor: position.cursor, limit } : { filters, startLedger: position.startLedger, limit }
    ) as GetEventsRequest;
    const res = await this.rpc.getEvents(request);
    const events: RegistryEvent[] = [];
    for (const e of res.events) {
      const raw: RawContractEvent = {
        id: e.id,
        ledger: e.ledger,
        txHash: e.txHash,
        contractId: e.contractId?.contractId() ?? this.options.contractId,
        closedAt: e.ledgerClosedAt,
        topic: e.topic,
        value: e.value,
      };
      const decoded = decodeEvent(raw);
      if (decoded) events.push(decoded);
    }
    const cursor = (res as { cursor?: string }).cursor ?? res.events.at(-1)?.id;
    return { events, cursor, latestLedger: res.latestLedger };
  }

  /** Arguments for the contract's `attest` function. */
  attestArgs(attester: string, a: Attestation): xdr.ScVal[] {
    if (!/^[0-9a-f]{64}$/.test(a.reportHash)) throw new RegistryError('reportHash must be a SHA-256 hex digest');
    return [
      new Address(attester).toScVal(),
      nativeToScVal(a.repo, { type: 'string' }),
      nativeToScVal(a.commit, { type: 'string' }),
      nativeToScVal(a.verdict, { type: 'symbol' }),
      nativeToScVal(Buffer.from(a.reportHash, 'hex'), { type: 'bytes' }),
    ];
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
}
