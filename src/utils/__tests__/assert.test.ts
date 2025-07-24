import { expect, test } from 'vitest';

import { assert as assertValidator } from '../validators/assert.ts';

test('should restrict type', () => {
  const variable: number | undefined = 3;
  assertValidator(variable);

  expect(typeof variable).toBe('number');
});

test('should throw error message', () => {
  const variable: number | undefined = 3;

  expect(() => {
    assertValidator(variable === 2, 'Error message');
  }).toThrow('Error message');
});

test('should throw default error message', () => {
  const variable: number | undefined = 3;

  expect(() => {
    assertValidator(variable === 2);
  }).toThrow('unreachable');
});
