import { createHash } from 'node:crypto';
import { Client as Bindings } from '@dome-security/registry-bindings';
import { Address, Keypair, nativeToScVal, Networks, rpc, scValToNative, StrKey, xdr } from '@stellar/stellar-sdk';
import { describe, expect, it } from 'vitest';
import { RegistryClient, type RpcLike } from './client.js';
import { decodeEvent, type RawContractEvent } from './decode.js';
import { repoIdOf, scannerVersion } from './schema.js';

const contractId = StrKey.encodeContract(Buffer.alloc(32, 7));
const otherContract = StrKey.encodeContract(Buffer.alloc(32, 8));
const attester = Keypair.random().publicKey();
const curator = Keypair.random().publicKey();
const options = { rpcUrl: 'https://rpc.example.invalid', contractId, networkPassphrase: Networks.TESTNET };
const bindings = new Bindings(options);
const parse = (t: xdr.ScVal[], d: xdr.ScVal) => bindings.parseEvent(t, d);

const meta = { id: '0000000001-0000000001', ledger: 10, txHash: 'ab'.repeat(32), contractId, closedAt: '2026-10-27T00:00:00Z' };
const sym = (v: string) => nativeToScVal(v, { type: 'symbol' });
const bytes = (b: Buffer) => nativeToScVal(b, { type: 'bytes' });
const u32 = (n: number) => nativeToScVal(n, { type: 'u32' });
const addr = (a: string) => new Address(a).toScVal();

/** Encodes an event the way the contract emits it: named topics, then a map of the data fields. */
function emitted(name: string, topics: xdr.ScVal[], data: Record<string, xdr.ScVal>): RawContractEvent {
  const map = xdr.ScVal.scvMap(
    Object.entries(data)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([k, v]) => new xdr.ScMapEntry({ key: sym(k), val: v })),
  );
  return { ...meta, topic: [sym(name), ...topics], value: map };
}

const repoId = repoIdOf('DOME-security', 'Dome-backend');
const fileHash = Buffer.alloc(32, 0xaa);
const evidence = Buffer.alloc(32, 0xbb);
const commit = Buffer.from('c'.repeat(40), 'hex');

describe('repoIdOf and scannerVersion', () => {
  it('hashes the lowercased github.com/<owner>/<repo> id', () => {
    expect(repoId).toBe(createHash('sha256').update('github.com/dome-security/dome-backend').digest('hex'));
    expect(repoIdOf('dome-security', 'DOME-BACKEND')).toBe(repoId);
    expect(() => repoIdOf('a/b', 'c')).toThrow();
    expect(() => repoIdOf('a', '..')).toThrow();
  });

  it('encodes semver as a non-zero u32', () => {
    expect(scannerVersion('0.1.0')).toBe(1000);
    expect(scannerVersion('1.2.3')).toBe(1_002_003);
    expect(() => scannerVersion('0.0.0')).toThrow();
    expect(() => scannerVersion('latest')).toThrow();
  });
});

describe('decodeEvent', () => {
  it('decodes attest events', () => {
    const e = decodeEvent(
      parse,
      emitted('attest', [bytes(Buffer.from(repoId, 'hex')), sym('clean')], { commit: bytes(commit), attester: addr(attester), index: u32(3) }),
    );
    expect(e).toEqual({ ...meta, type: 'attest', repoId, verdict: 'clean', commit: 'c'.repeat(40), attester, index: 3 });
  });

  it('decodes the indicator lifecycle: propose, approve, retract', () => {
    const topic = [bytes(fileHash)];
    expect(
      decodeEvent(parse, emitted('propose', topic, { kind: sym('font'), campaign: sym('demo'), evidence: bytes(evidence), curator: addr(curator) })),
    ).toMatchObject({ type: 'propose', hash: 'aa'.repeat(32), fileKind: 'font', campaign: 'demo', evidence: 'bb'.repeat(32), curator });
    expect(decodeEvent(parse, emitted('approve', topic, { curator: addr(curator), approvals: u32(2), status: sym('active') }))).toMatchObject({
      type: 'approve',
      status: 'active',
      approvals: 2,
    });
    expect(decodeEvent(parse, emitted('retract', topic, { curator: addr(curator), reason: bytes(evidence) }))).toMatchObject({
      type: 'retract',
      reason: 'bb'.repeat(32),
    });
  });

  it('decodes attestation retractions', () => {
    expect(
      decodeEvent(parse, emitted('retract_attest', [bytes(Buffer.from(repoId, 'hex'))], { index: u32(0), by: addr(attester), reason: bytes(evidence) })),
    ).toMatchObject({ type: 'retract_attest', repoId, index: 0, by: attester });
  });

  it('drops events that do not match the schema or are not used', () => {
    // Unknown verdict symbol.
    expect(
      decodeEvent(parse, emitted('attest', [bytes(Buffer.from(repoId, 'hex')), sym('safe')], { commit: bytes(commit), attester: addr(attester), index: u32(0) })),
    ).toBeUndefined();
    // Commit that is not 20 or 32 bytes.
    expect(
      decodeEvent(parse, emitted('attest', [bytes(Buffer.from(repoId, 'hex')), sym('block')], { commit: bytes(Buffer.alloc(7)), attester: addr(attester), index: u32(0) })),
    ).toBeUndefined();
    // Unknown indicator kind.
    expect(
      decodeEvent(parse, emitted('propose', [bytes(fileHash)], { kind: sym('virus'), campaign: sym('x'), evidence: bytes(evidence), curator: addr(curator) })),
    ).toBeUndefined();
    // Events this backend ignores, and events the contract does not define.
    expect(decodeEvent(parse, emitted('threshold_changed', [], { threshold: u32(2) }))).toBeUndefined();
    expect(decodeEvent(parse, emitted('transfer', [], {}))).toBeUndefined();
    expect(decodeEvent(parse, { ...meta, topic: [], value: xdr.ScVal.scvVoid() })).toBeUndefined();
  });
});

function fakeRpc(overrides: Partial<RpcLike>): RpcLike {
  return overrides as RpcLike;
}

describe('RegistryClient', () => {
  const raw = emitted('approve', [bytes(fileHash)], { curator: addr(curator), approvals: u32(2), status: sym('active') });
  const rpcEvent = (cid: string) =>
    ({ id: raw.id, ledger: 10, txHash: raw.txHash, ledgerClosedAt: raw.closedAt, contractId: new (class { contractId = () => cid })(), topic: raw.topic, value: raw.value }) as never;

  it('pages through contract events, keeps the RPC cursor and ignores other contracts', async () => {
    const client = new RegistryClient(
      options,
      fakeRpc({
        async getEvents() {
          return { events: [rpcEvent(contractId), rpcEvent(otherContract)], latestLedger: 99, cursor: 'next' } as unknown as rpc.Api.GetEventsResponse;
        },
      }),
    );
    const page = await client.events({ startLedger: 1 });
    expect(page.events).toHaveLength(1);
    expect(page.events[0]).toMatchObject({ type: 'approve', contractId });
    expect(page.cursor).toBe('next');
    expect(page.latestLedger).toBe(99);
  });

  it('encodes attest arguments with the contract spec', () => {
    const client = new RegistryClient(options, fakeRpc({}));
    const args = client.attestArgs(attester, {
      owner: 'DOME-security',
      repo: 'Dome-backend',
      commit: 'c'.repeat(40),
      verdict: 'block',
      scanner: scannerVersion('0.1.0'),
      rulesHash: 'd'.repeat(64),
      reportHash: 'e'.repeat(64),
    });
    expect(args.map((a) => (a as unknown as { type: string }).type)).toEqual(['scvAddress', 'scvMap']);
    const input = scValToNative(args[1]!) as Record<string, unknown>;
    expect(Object.keys(input).sort()).toEqual(['commit', 'repo', 'report', 'rules', 'scanner', 'verdict']);
    expect(Buffer.from(input.repo as Uint8Array).toString('hex')).toBe(repoId);
    expect(Buffer.from(input.commit as Uint8Array)).toHaveLength(20);
    expect(input).toMatchObject({ verdict: 'block', scanner: 1000 });
    const valid = { owner: 'o', repo: 'r', commit: 'c'.repeat(40), verdict: 'clean' as const, scanner: 1, rulesHash: 'd'.repeat(64), reportHash: 'e'.repeat(64) };
    expect(() => client.attestArgs(attester, { ...valid, commit: 'c' })).toThrow();
    expect(() => client.attestArgs(attester, { ...valid, reportHash: 'nope' })).toThrow();
    expect(() => client.attestArgs(attester, { ...valid, scanner: 0 })).toThrow();
  });

  it('reads a stored attestation with a simulated history call', async () => {
    const stored = xdr.ScVal.scvVec([
      xdr.ScVal.scvMap(
        Object.entries({
          at: nativeToScVal(1_761_000_000n, { type: 'u64' }),
          attester: addr(attester),
          commit: bytes(commit),
          repo: bytes(Buffer.from(repoId, 'hex')),
          report: bytes(Buffer.alloc(32, 0xee)),
          retract_reason: xdr.ScVal.scvVoid(),
          retracted_by: xdr.ScVal.scvVoid(),
          rules: bytes(Buffer.alloc(32, 0xdd)),
          scanner: u32(1000),
          verdict: sym('review'),
        }).map(([k, v]) => new xdr.ScMapEntry({ key: sym(k), val: v })),
      ),
    ]);
    let calledWith: string | undefined;
    const client = new RegistryClient(
      options,
      fakeRpc({
        async simulateTransaction(tx) {
          const op = tx.operations[0] as unknown as { func: unknown };
          calledWith = (JSON.parse(JSON.stringify(op.func, (_k, v: unknown) => (typeof v === 'bigint' ? String(v) : v))) as {
            invoke_contract: { function_name: string };
          }).invoke_contract.function_name;
          return { result: { retval: stored }, transactionData: {}, minResourceFee: '0', events: [], latestLedger: 1, _parsed: true } as never;
        },
      }),
    );
    const a = await client.readAttestation(repoId, 0);
    expect(calledWith).toBe('history');
    expect(a).toEqual({
      repoId,
      index: 0,
      commit: 'c'.repeat(40),
      verdict: 'review',
      scanner: 1000,
      rulesHash: 'dd'.repeat(32),
      reportHash: 'ee'.repeat(32),
      attester,
      at: 1_761_000_000,
      retractedBy: null,
      retractReason: null,
    });
  });
});
