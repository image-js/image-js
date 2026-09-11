import { expect, test } from 'vitest';

import { getShiTomasiScore } from '../getShiTomasiScore.ts';

test('7x7 image with darker and lighter areas', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 50, 0, 0, 0],
    [0, 0, 0, 50, 50, 0, 0],
    [0, 0, 50, 100, 100, 50, 0],
    [0, 50, 100, 100, 100, 100, 50],
  ]);

  const origin = { row: 3, column: 3 };

  const result = getShiTomasiScore(image, origin);

  expect(result).toBeCloseTo(487099.36, 0);
});

test('7x7 image with other corner', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 50, 0, 0, 0],
    [0, 0, 50, 0, 50, 0, 0],
    [0, 50, 0, 0, 0, 50, 0],
    [50, 0, 0, 0, 0, 0, 50],
  ]);

  const origin = { row: 3, column: 3 };
  const result = getShiTomasiScore(image, origin);

  expect(result).toBeCloseTo(70000, 0);
});

test('7x7 image with corner 90 degrees, bottom-right', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 255, 255, 255, 255],
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
  ]);

  const origin = { row: 3, column: 3 };

  const result = getShiTomasiScore(image, origin);

  expect(result).toBeCloseTo(3641400, 0);
});

test('7x7 image with corner 90 degrees, bottom-left', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [255, 255, 255, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
  ]);

  const origin = { row: 3, column: 3 };

  const result = getShiTomasiScore(image, origin);

  expect(result).toBeCloseTo(3641400, 0);
});

test('throws with RGB image', () => {
  const image = testUtils.createRgbImage([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);

  expect(() => getShiTomasiScore(image, { row: 1, column: 1 })).toThrow(
    'image channels must be 1 to apply this algorithm',
  );
});
