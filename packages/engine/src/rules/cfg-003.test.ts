import { describe, expect, it } from 'vitest';
import { runRule } from '../__fixtures__/run-rule.js';
import rule from './cfg-003.js';

describe('DOME-CFG-003', () => {
  it('reports eval, Function and vm in config and route files', async () => {
    const files = {
      'next.config.js': 'eval(atob("RE9NRV9GSVhUVVJF"));\nmodule.exports = {};',
      'pages/api/hello.ts': 'export default function h() { return new Function("return 1")(); }',
      'src/routes/x.js': "require('vm').runInThisContext(code);",
    };
    expect((await runRule(rule, files)).map((r) => r.split('@')[0])).toEqual(['review:eval', 'review:function', 'review:vm']);
  });

  it('reports a detached hidden spawn', async () => {
    const code = "spawn(process.execPath, [f], { detached: true, stdio: 'ignore', windowsHide: true }).unref();";
    expect(await runRule(rule, { 'server.js': code })).toEqual(['review:hiddenSpawn@server.js:1']);
  });

  it('ignores ordinary code and component files', async () => {
    const files = { 'server.js': 'app.listen(3000);', 'src/components/x.js': 'eval(x)' };
    expect(await runRule(rule, files)).toEqual([]);
  });
});
