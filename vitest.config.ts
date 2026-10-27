import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    conditions: ['development'],
  },
  test: {
    include: ['packages/*/src/**/*.test.ts', 'test/**/*.test.ts'],
    environment: 'node',
    testTimeout: 20_000,
  },
});
