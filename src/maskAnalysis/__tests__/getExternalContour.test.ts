import { expect, test } from 'vitest';

import { Mask } from '../../Mask.ts';
import { getExternalContour } from '../getExternalContour.js';

test('square', () => {
  const testMask = testUtils.createMask([
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ]);
  const points = getExternalContour(testMask);

  expect(points).toStrictEqual([
    { column: 0, row: 0 },
    { column: 1, row: 0 },
    { column: 2, row: 0 },
    { column: 2, row: 1 },
    { column: 2, row: 2 },
    { column: 1, row: 2 },
    { column: 0, row: 2 },
    { column: 0, row: 1 },
  ]);
});

test('square with Pavlidis', () => {
  const testMask = testUtils.createMask([
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ]);
  const points = getExternalContour(testMask, { connectivity: 4 });

  expect(points).toStrictEqual([
    { column: 0, row: 0 },
    { column: 1, row: 0 },
    { column: 2, row: 0 },
    { column: 2, row: 1 },
    { column: 2, row: 2 },
    { column: 1, row: 2 },
    { column: 0, row: 2 },
    { column: 0, row: 1 },
  ]);
});

test('random shape', () => {
  const mask = testUtils.createMask([
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ]);
  const points = getExternalContour(mask);

  expect(points).toBeDeepCloseTo([
    { column: 2, row: 0 },
    { column: 2, row: 1 },
    { column: 3, row: 2 },
    { column: 4, row: 2 },
    { column: 2, row: 2 },
    { column: 1, row: 3 },
    { column: 0, row: 4 },
  ]);
});

test('5x6 mask with hole, no inner borders', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ]);
  const points = getExternalContour(mask);

  const bordersMask = Mask.fromPoints(mask.width, mask.height, points);

  expect(bordersMask).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ]);
});
