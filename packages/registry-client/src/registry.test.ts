import { Address, Keypair, nativeToScVal, Networks, rpc, scValToNative, StrKey, xdr } from '@stellar/stellar-sdk';
import { describe, expect, it } from 'vitest';
import { RegistryClient, type RpcLike } from './client.js';
import { decodeEvent, type RawContractEvent } from './decode.js';

const contractId = StrKey.encodeContract(Buffer.alloc(32, 7));
const attester = Keypair.random().publicKey();
const meta = { id: '0000000001-0000000001', ledger: 10, txHash: 'ab'.repeat(32), contractId, closedAt: '2026-10-27T00:00:00Z' };

function event(name: string, body: Record<string, xdr.ScVal>): RawContractEvent {
  const map = xdr.ScVal.scvMap(
    Object.entries(body)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => new xdr.ScMapEntry({ key: nativeToScVal(k, { type: 'symbol' }), val: v })),
  );
  return { ...meta, topic: [nativeToScVal(name, { type: 'symbol' })], value: map };
}

const s = (v: string) => nativeToScVal(v, { type: 'string' });
const sym = (v: string) => nativeToScVal(v, { type: 'symbol' });

describe('decodeEvent', () => {
  it('decodes attest events', () => {
    const e = decodeEvent(
      event('attest', {
        repo: s('dome-security/dome-backend'),
        commit: s('a'.repeat(40)),
        verdict: sym('clean'),
        report_hash: nativeToScVal(Buffer.alloc(32, 1), { type: 'bytes' }),
        attester: new Address(attester).toScVal(),
      }),
    );
    expect(e).toMatchObject({ type: 'attest', repo: 'dome-security/dome-backend', verdict: 'clean', reportHash: '01'.repeat(32), attester });
  });

  it('decodes approve and revoke events', () => {
    const approve = decodeEvent(
      event('approve', { kind: sym('package'), value: s('dome-fixture-evil'), campaign: s('Test'), evidence: xdr.ScVal.scvVec([s('https://example.invalid')]) }),
    );
    expect(approve).toMatchObject({ type: 'approve', kind: 'package', value: 'dome-fixture-evil', evidence: ['https://example.invalid'] });
    expect(decodeEvent(event('revoke', { kind: sym('hash'), value: s('b'.repeat(64)) }))).toMatchObject({ type: 'revoke', kind: 'hash' });
  });

  it('drops events that do not match the schema', () => {
    expect(decodeEvent(event('attest', { repo: s('../x'), commit: s('a'.repeat(40)) }))).toBeUndefined();
    expect(decodeEvent(event('approve', { kind: sym('virus'), value: s('x'), campaign: s('y') }))).toBeUndefined();
    expect(decodeEvent(event('transfer', {}))).toBeUndefined();
  });
});

describe('RegistryClient', () => {
  const fakeRpc = (events: rpc.Api.GetEventsResponse['events']): RpcLike =>
    ({
      async getEvents() {
        return { events, latestLedger: 99, cursor: 'next' } as unknown as rpc.Api.GetEventsResponse;
      },
    }) as unknown as RpcLike;

  it('pages through contract events and keeps the RPC cursor', async () => {
    const raw = event('revoke', { kind: sym('domain'), value: s('dome-fixture.invalid') });
    const client = new RegistryClient(
      { rpcUrl: 'https://rpc.example.invalid', contractId, networkPassphrase: Networks.TESTNET },
      fakeRpc([{ id: raw.id, ledger: 10, txHash: raw.txHash, ledgerClosedAt: raw.closedAt, topic: raw.topic, value: raw.value } as never]),
    );
    const page = await client.events({ startLedger: 1 });
    expect(page.events).toHaveLength(1);
    expect(page.cursor).toBe('next');
    expect(page.latestLedger).toBe(99);
  });

  it('encodes attest arguments in contract order', () => {
    const client = new RegistryClient({ rpcUrl: 'https://rpc.example.invalid', contractId, networkPassphrase: Networks.TESTNET }, fakeRpc([]));
    const args = client.attestArgs(attester, { repo: 'o/r', commit: 'c'.repeat(40), verdict: 'block', reportHash: 'd'.repeat(64) });
    expect(args.map((a) => a.switch().name)).toEqual(['scvAddress', 'scvString', 'scvString', 'scvSymbol', 'scvBytes']);
    expect(scValToNative(args[3]!)).toBe('block');
    expect(() => client.attestArgs(attester, { repo: 'o/r', commit: 'c', verdict: 'block', reportHash: 'nope' })).toThrow();
  });
});
