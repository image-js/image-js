import { expect, test } from 'vitest';

import { getExtrema } from '../../../compute/getExtrema.js';
import { removeClosePoints } from '../removeClosePoints.js';

test('combine minimum points on 5x5 image', () => {
  const image = testUtils.createGreyImage([
    [5, 5, 5, 5, 5],
    [5, 2, 2, 2, 5],
    [5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5],
    [5, 0, 1, 5, 5],
  ]);

  const points = [
    { column: 1, row: 1 },
    { column: 1, row: 4 },
    { column: 3, row: 1 },
    { column: 2, row: 4 },
  ];

  const result = removeClosePoints(points, image, {
    distance: 3,
    kind: 'minimum',
    channel: 0,
  });

  expect(result).toStrictEqual([
    { column: 1, row: 4 },
    { column: 1, row: 1 },
  ]);
});

test('combine maximum points on 3x3 image', () => {
  const image = testUtils.createGreyImage([
    [1, 1, 1],
    [1, 6, 6],
    [1, 1, 1],
  ]);
  const points = [
    { column: 2, row: 1 },
    { column: 2, row: 2 },
  ];

  const result = removeClosePoints(points, image, {
    distance: 2,
    kind: 'maximum',
  });

  expect(result).toStrictEqual([{ column: 2, row: 1 }]);
});

test('combine maximum points after getExtrema function', () => {
  const image = testUtils.createGreyImage([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 4, 4, 4, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 6, 1, 6, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 6, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 5, 1, 6, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]);

  const points = getExtrema(image, {
    kind: 'maximum',
    algorithm: 'star',
  });

  const result = removeClosePoints(points, image, {
    kind: 'maximum',
    distance: 3,
  });

  expect(result).toStrictEqual([
    { column: 3, row: 5 },
    { column: 7, row: 6 },
    { column: 2, row: 2 },
  ]);
});

test('test error handling', () => {
  const image = testUtils.createRgbaImage([
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 6, 1, 1],
    [1, 1, 1, 1],
    [1, 5, 6, 1],
  ]);

  expect(() => {
    const points = getExtrema(image, {
      kind: 'maximum',
      algorithm: 'star',
    });

    const result = removeClosePoints(points, image, {
      kind: 'maximum',
      distance: 0,
    });
    return result;
  }).toThrow(
    'image channel must be specified or image must have only one channel',
  );
});
