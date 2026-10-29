/**
 * Proves a scan worker cannot reach hosts other than GitHub. It runs the real
 * worker image on an internal network (no route out) next to the egress proxy
 * and probes from inside. Needs Docker and the internet, so it is opt-in:
 *
 *   DOME_SANDBOX_TEST=1 pnpm test:sandbox
 */
import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const enabled = process.env.DOME_SANDBOX_TEST === '1';
const id = randomBytes(4).toString('hex');
const net = `dome-sandbox-${id}`;
const proxy = `dome-egress-${id}`;
const root = new URL('../../', import.meta.url).pathname;

const docker = (...args: string[]) => execFileSync('docker', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 600_000 }).trim();

/** Runs inside a container that has nothing but node. Prints one JSON object. */
const PROBE = `
const net = require('node:net'); const fs = require('node:fs');
const proxyHost = process.env.PROXY_HOST || 'egress-proxy';
const connect = (host) => new Promise((done) => {
  const s = net.connect({ host, port: 443, timeout: 4000 });
  s.on('connect', () => { s.destroy(); done('connected'); });
  s.on('timeout', () => { s.destroy(); done('blocked'); });
  s.on('error', () => done('blocked'));
});
const tunnel = (host) => new Promise((done) => {
  const s = net.connect({ host: proxyHost, port: 8888, timeout: 15000 });
  let buf = '';
  s.on('connect', () => s.write('CONNECT ' + host + ':443 HTTP/1.1\\r\\nHost: ' + host + ':443\\r\\n\\r\\n'));
  s.on('data', (d) => { buf += d; if (buf.includes('\\r\\n')) { s.destroy(); done(buf.split('\\r\\n')[0]); } });
  s.on('error', (e) => done('error ' + e.code));
  s.on('timeout', () => { s.destroy(); done('timeout'); });
});
let write = 'allowed';
try { fs.writeFileSync('/app/probe', 'x'); } catch (e) { write = e.code; }
(async () => {
  const out = {
    uid: process.getuid(),
    caps: /CapEff:\\s*(\\w+)/.exec(fs.readFileSync('/proc/self/status', 'utf8'))[1],
    write,
    env: Object.keys(process.env).filter((k) => /KEY|SECRET|TOKEN|PASSWORD/i.test(k)),
    directIp: await connect('1.1.1.1'),
    directName: await connect('example.com'),
  };
  if (process.env.PROBE_PROXY) {
    out.otherViaProxy = await tunnel('example.com');
    out.lookalikeViaProxy = await tunnel('github.com.example.com');
    out.githubViaProxy = await tunnel('github.com');
  }
  console.log(JSON.stringify(out));
})();
`;

/** The restrictions the worker service has in docker-compose.yml. */
const WORKER_FLAGS = [
  '--read-only', '--tmpfs', '/tmp:size=64m,mode=1777', '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges:true',
  '--pids-limit', '256', '--memory', '256m', '--cpus', '1',
];

const probe = (image: string, flags: string[], env: Record<string, string> = {}): Record<string, unknown> =>
  JSON.parse(
    docker('run', '--rm', ...flags, ...Object.entries(env).flatMap(([k, v]) => ['-e', `${k}=${v}`]), image, 'node', '-e', PROBE),
  ) as Record<string, unknown>;

const cleanup: string[][] = [];
afterAll(() => {
  for (const cmd of cleanup.reverse()) {
    try {
      docker(...cmd);
    } catch {
      // Best-effort cleanup.
    }
  }
});

describe.skipIf(!enabled)('worker sandbox', () => {
  const workerImage = `dome-worker:${id}`;
  const proxyImage = `dome-egress:${id}`;

  beforeAll(() => {
    cleanup.push(['rmi', '-f', workerImage, proxyImage]);
    docker('build', '--target', 'worker', '-t', workerImage, root);
    docker('build', '--target', 'egress-proxy', '-t', proxyImage, root);
  }, 900_000);

  describe('the worker container', () => {
    it('runs unprivileged on a read-only filesystem with no credentials', () => {
      const report = probe(workerImage, [...WORKER_FLAGS, '--network', 'none']);
      expect(report.uid).not.toBe(0);
      expect(report.caps).toBe('0000000000000000');
      expect(report.write).toBe('EROFS');
      expect(report.env).toEqual([]);
    });

    it('cannot open a connection to any host from an internal network', () => {
      // Control: the same probe on the default network does reach the internet,
      // so a block below is down to --internal and not to a missing connection.
      expect(probe(workerImage, WORKER_FLAGS).directIp).toBe('connected');

      cleanup.push(['network', 'rm', net]);
      docker('network', 'create', '--internal', net);
      const report = probe(workerImage, [...WORKER_FLAGS, '--network', net]);
      expect(report.directIp).toBe('blocked');
      expect(report.directName).toBe('blocked');
    });
  });

  describe('the egress proxy', () => {
    let policy: Record<string, unknown>;
    beforeAll(() => {
      cleanup.push(['rm', '-f', proxy]);
      docker('run', '-d', '--name', proxy, proxyImage);
      execFileSync('sleep', ['2']);
      // Share the proxy's network namespace and talk to it over loopback.
      policy = probe(workerImage, [...WORKER_FLAGS, '--network', `container:${proxy}`], { PROBE_PROXY: '1', PROXY_HOST: '127.0.0.1' });
    }, 120_000);

    it('refuses to tunnel to any host except GitHub, including look-alike names', () => {
      expect(policy.otherViaProxy).toMatch(/ 403 /);
      expect(policy.lookalikeViaProxy).toMatch(/ 403 /);
    });

    it('still tunnels to GitHub, so the refusals are the allowlist and not a broken proxy', () => {
      expect(policy.githubViaProxy).toMatch(/ 200 /);
    });
  });

  // Needs containers to reach each other, which not every Docker host allows.
  describe.skipIf(process.env.DOME_SANDBOX_TOPOLOGY !== '1')('the compose topology', () => {
    it('reaches GitHub only through the proxy from the internal network', () => {
      const topo = `dome-topo-${id}`;
      const topoProxy = `dome-topo-proxy-${id}`;
      cleanup.push(['rm', '-f', topoProxy], ['network', 'rm', topo]);
      docker('network', 'create', '--internal', topo);
      docker('run', '-d', '--name', topoProxy, '--network', topo, '--network-alias', 'egress-proxy', proxyImage);
      docker('network', 'connect', 'bridge', topoProxy);
      execFileSync('sleep', ['2']);
      const report = probe(workerImage, [...WORKER_FLAGS, '--network', topo], { PROBE_PROXY: '1' });
      expect(report.directIp).toBe('blocked');
      expect(report.otherViaProxy).toMatch(/ 403 /);
      expect(report.githubViaProxy).toMatch(/ 200 /);
    }, 120_000);
  });
});
