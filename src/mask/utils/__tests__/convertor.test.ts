import { convertToNumber } from '../convertor';

test('convert number to number', () => {
  expect(convertToNumber(1)).toBe(1);
  expect(convertToNumber(0)).toBe(0);
});

test('convert boolean to number', () => {
  expect(convertToNumber(true)).toBe(1);
  expect(convertToNumber(false)).toBe(0);
});
