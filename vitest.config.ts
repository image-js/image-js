import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 10_000,
    coverage: {
      include: ['src/**'],
    },
    reporters: [
      'default',
      'jest-image-snapshot/src/outdated-snapshot-reporter.js',
    ],
  },
});
