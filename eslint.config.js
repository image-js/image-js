import react from 'eslint-config-cheminfo-react/base';
import typescript from 'eslint-config-cheminfo-typescript';

export default [
  ...typescript,
  ...react,
  {
    rules: {
      '@typescript-eslint/restrict-template-expressions': 'off',
    },
  },
  {
    files: ['demo/**'],
    rules: { 'no-console': 'off' },
  },
];
