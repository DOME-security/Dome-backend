# Vendored Dome Registry bindings

`registry-bindings/` is an **unmodified** copy of `@dome-security/registry-bindings`,
the TypeScript client generated from the Dome Registry contract in
[DOME-security/Dome-contracts](https://github.com/DOME-security/Dome-contracts)
(`bindings/ts`). It is vendored because the package is not published to npm yet.

| | |
|---|---|
| Source | `DOME-security/Dome-contracts`, `bindings/ts` |
| Commit | `66d3fdc945742890cc9eb78e8f1a5b4904965d35` (2026-10-28) |
| Generator | `stellar-js generate` from `@stellar/stellar-sdk` 17.2.1, pinned in `tools/bindgen` |

File hashes (SHA-256), checked by `src/vendor.test.ts`:

```
0292a457d72e4080a91e76137f3c85ae5cbbad8a7a792d35df67063d62dbd2f9  registry-bindings/src/client.ts
37af556a87abd7980fc44ebaaf305c952d95baafadad4b29f17c81775c5bc41f  registry-bindings/src/index.ts
4e7bfdd28ccdd39033bb9651ba2d385c3796b7bd25853c26175960c8db5c0454  registry-bindings/src/types.ts
a345f5dab45ae68a9ce6f89e60a6b66a92b283fa630d1f4cb9b08f0c3ab75982  registry-bindings/package.json
4175f471d165093001893823da0672df6b2bc736f8f535277e0fda3e38fcce70  registry-bindings/README.md
c1fd8097875729dcdcdd121c9735a1726b8b9a5e019d1c10e1f944e6a56136a2  registry-bindings/tsconfig.json
```

Rules:

- Never edit files under `registry-bindings/`. The generated code does not
  follow this repository's strict compiler settings, so it is built by
  `tsconfig.bindings.json` next to this file instead.
- `@stellar/stellar-sdk` in `packages/registry-client` stays on the exact
  version the bindings were generated with.

## Updating

1. In Dome-contracts, regenerate with `make bindings` and merge.
2. Copy `bindings/ts/{src/*.ts,package.json,README.md,tsconfig.json}` from that
   commit into `registry-bindings/` (for example with `git show <sha>:bindings/ts/src/client.ts`).
3. Update the commit and the hashes above and in `src/vendor.test.ts`.
4. Run `pnpm build && pnpm test`. If the contract interface changed,
   `src/decode.ts` and `src/client.ts` are the places to adapt.

## Removing

Once `@dome-security/registry-bindings` is on npm, depend on that exact
version instead, delete this folder, and drop it from `pnpm-workspace.yaml`,
the root `build` script and `vitest.config.ts`.
