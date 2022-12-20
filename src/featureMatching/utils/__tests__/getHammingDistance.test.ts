import { getHammingDistance } from '../getHammingDistance';

test('distance should be 0', () => {
  const a = new Uint8Array([0, 1, 0, 0, 0, 0, 0]);
  expect(getHammingDistance(a, a)).toBe(0);
});

test('distance should be array length', () => {
  const a = new Uint8Array([0, 1, 0, 0, 0, 0, 0]);
  const b = new Uint8Array([1, 0, 1, 1, 1, 1, 1]);

  expect(getHammingDistance(a, b)).toBe(a.length);
});

test('two random arrays', () => {
  const a = new Uint8Array([1, 0, 0, 0, 1, 1, 0]);
  const b = new Uint8Array([0, 0, 1, 0, 1, 1, 0]);

  expect(getHammingDistance(a, b)).toBe(2);
});
