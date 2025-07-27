import { defineConfig, globalIgnores } from 'eslint/config';
import react from 'eslint-config-cheminfo-react/base';
import typescript from 'eslint-config-cheminfo-typescript';

export default defineConfig(
  globalIgnores(['coverage', 'dist', 'dist-types', 'lib']),
  typescript,
  {
    rules: {
      '@typescript-eslint/restrict-template-expressions': 'off',
    },
  },
  {
    files: ['demo/**'],
    extends: [react],
    rules: { 'no-console': 'off' },
  },
  {
    files: ['scripts/**'],
    rules: { 'no-console': 'off' },
  },
);
