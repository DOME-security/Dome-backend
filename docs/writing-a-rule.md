# Writing a rule

A rule reads files from the scanned tree and reports fixed reasons. It never
runs anything, never touches the network, and never copies text from the
repository into a finding.

## 1. Pick an ID and category

IDs are `DOME-<AREA>-<NNN>` and never change once released. Categories:

| Category | Area codes | Use for |
|---|---|---|
| `autorun` | `VSC`, `NPM`, `DEV`, `AGT`, `GHA`, `GIT` | Files that make something run without asking |
| `payload` | `AST`, `CFG`, `ENV`, `PRP` | Content that hides or delivers code |
| `intel` | `IOC` | Matches against indicator data |
| `stellar` | `STL` | Stellar keys and wallets |

## 2. Write the rule

Create `packages/engine/src/rules/<area>-<nnn>.ts`:

```ts
import { defineRule, targetsWhere } from './rule.js';
import { REFS } from './shared.js';

export default defineRule(
  {
    id: 'DOME-XYZ-001',
    title: 'Short title',
    category: 'autorun',
    severity: 'review',
    summary: 'One sentence: what the rule detects.',
    reasons: {
      found: 'Fixed sentence shown to maintainers.',
    },
    doc: {
      why: 'Which incident used this and why it matters.',
      falsePositives: 'Honest projects that also trigger it, and what to do.',
      references: [REFS.polinRider],
    },
  },
  async (ctx) => {
    for (const { path } of targetsWhere(ctx, (p) => p.endsWith('.example'))) {
      const text = await ctx.readText(path);
      if (text === undefined) continue;
      const at = text.indexOf('DOME_FIXTURE');
      if (at !== -1) ctx.report('found', ctx.locate(path, at));
    }
  },
);
```

Rules of thumb:

- **Report reason keys, not text.** `ctx.report` only accepts keys of
  `reasons`, so a repository cannot write its own verdict.
- **Use the parsers.** `parsers/` has a JSONC reader, a quote-aware shell
  tokenizer (`nodeInvocations`, `downloadsAndRuns`), a JS tokenizer, font
  header checks and manifest readers. Do not evaluate or `JSON.parse` your way
  around them, and do not use backtracking regular expressions on file content.
- **Respect diff scans.** `ctx.targets` is only what changed; resolve
  references with `ctx.tree` and compare with `ctx.readBaseText` when "added or
  changed" matters.
- **Unreadable is not clean.** `ctx.readText` returns `undefined` for files it
  could not read and records them, so the scan ends as "could not check".
- **Skip what is not authored code** with `isVendored` and `isTestPath` when a
  heuristic would be noisy there.

Register the rule in `packages/engine/src/rules/index.ts`. If it is a payload
that should block when an auto-run surface is in the same change, add it to
`PAYLOAD_PARTNERS` in `grade.ts`.

## 3. Test it with inert fixtures

Add `<area>-<nnn>.test.ts` next to the rule. `runRule` scans an in-memory tree:

```ts
import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './xyz-001.js';

describe('DOME-XYZ-001', () => {
  it('reports the pattern', async () => {
    expect(await runRule(rule, { 'a.example': 'DOME_FIXTURE' })).toEqual(['review:found@a.example:1']);
  });

  it('ignores honest files', async () => {
    expect(await runRule(rule, { 'a.example': 'hello' })).toEqual([]);
  });
});
```

Fixtures must **look** like the attack and **do nothing**: echo
`DOME_FIXTURE`, use plain text for fake fonts, `.invalid` hosts for URLs and
no-op code. Build secret-looking values (keys, tokens) at test time instead
of committing them. If the rule changes a scenario's outcome, update
`test/fixtures/<scenario>/expected.json` or add a scenario.

## 4. Document it and check false positives

```bash
pnpm docs:rules     # regenerates docs/rules from the metadata
pnpm test           # unit tests, scenarios and the docs freshness check
pnpm test:corpus    # no honest repository may be blocked
```

Include the corpus output in the pull request for any rule change.
