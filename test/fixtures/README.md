# Inert scenario fixtures

Each folder is a small repository that **looks** like a real attack (or like an
honest project that uses the same features) but **does nothing**. Every marker
is `DOME_FIXTURE`, every host is on the reserved `.invalid` domain, fake fonts
are plain text, and appended code is a no-op.

`expected.json` lists the verdict and the rule IDs the full scan must report.
`test/scenarios.test.ts` scans every folder and compares.

Never add real malware, real obfuscated payloads or live attacker URLs here.
Known-bad hashes, markers, packages and domains belong only in
`packages/intel` data files.
