import { assert } from '../validators/assert.js';

test('should restrict type', () => {
  const variable: number | undefined = 3;
  assert(variable);
  expect(typeof variable).toBe('number');
});

test('should throw error message', () => {
  const variable: number | undefined = 3;
  expect(() => {
    assert(variable === 2, 'Error message');
  }).toThrow('Error message');
});

test('should throw default error message', () => {
  const variable: number | undefined = 3;
  expect(() => {
    assert(variable === 2);
  }).toThrow('unreachable');
});
