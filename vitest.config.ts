import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    conditions: ['development'],
  },
  test: {
    include: ['packages/*/src/**/*.test.ts', 'test/**/*.test.ts'],
    environment: 'node',
    testTimeout: 20_000,
    coverage: {
      provider: 'v8',
      // The engine reads untrusted repositories; it is held to a coverage floor.
      include: ['packages/engine/src/**/*.ts'],
      exclude: ['**/*.test.ts', 'packages/engine/src/__fixtures__/**', 'packages/engine/src/bin/**'],
      reporter: ['text-summary', 'text', 'json-summary'],
      thresholds: { lines: 90, statements: 90, functions: 90, branches: 80 },
    },
  },
});
