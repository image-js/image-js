import { expect, test } from 'vitest';

import { getEigenvaluesForScore } from '../getEigenvaluesForScore.ts';

test('windowSize error', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 200, 0, 0, 0],
    [0, 0, 0, 100, 0, 0, 0],
    [0, 0, 0, 100, 0, 0, 0],
    [0, 0, 0, 100, 0, 0, 0],
  ]);

  const origin = { row: 3, column: 3 };

  expect(() => getEigenvaluesForScore(image, origin, 6)).toThrow(
    'windowSize must be an odd integer',
  );
});

test('multi-channel image error', () => {
  const image = testUtils.createRgbImage([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);

  expect(() => getEigenvaluesForScore(image, { row: 1, column: 1 }, 1)).toThrow(
    'image channels must be 1 to apply this algorithm',
  );
});

test('window out of the image error', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);

  expect(() => getEigenvaluesForScore(image, { row: 1, column: 1 }, 3)).toThrow(
    'Size is out of range',
  );
});

test('non-integer origin error', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  expect(() =>
    getEigenvaluesForScore(image, { row: 2.5, column: 2 }, 1),
  ).toThrow('Origin row and column must be integers');
});
