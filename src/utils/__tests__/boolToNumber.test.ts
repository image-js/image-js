import { boolToNumber } from '../boolToNumber';

test('convert number to number', () => {
  expect(boolToNumber(1)).toBe(1);
  expect(boolToNumber(0)).toBe(0);
});

test('convert boolean to number', () => {
  expect(boolToNumber(true)).toBe(1);
  expect(boolToNumber(false)).toBe(0);
});
