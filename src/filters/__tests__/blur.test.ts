import { expect, test } from 'vitest';

test('blur compared to opencv', () => {
  const img = testUtils.load('opencv/test.png');

  const blurred = img.blur({
    width: 3,
    height: 5,
    borderType: 'reflect',
  });

  const expected = testUtils.load('opencv/testBlur.png');

  expect(blurred).toMatchImage(expected);
});

test('error handling', () => {
  const img = testUtils.load('opencv/test.png');
  expect(() => {
    img.blur({ width: 2, height: 2 });
  }).toThrow('Width must be an odd number. Got 2.');
  expect(() => {
    img.blur({ width: -3, height: 2 });
  }).toThrow('Width must be greater than 0. Got -3.');
});
