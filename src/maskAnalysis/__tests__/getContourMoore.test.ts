import { expect, test } from 'vitest';

import { Mask } from '../../Mask.ts';
import { getContourMoore } from '../getContourMoore.ts';

test('empty mask', () => {
  const mask = testUtils.createMask([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);

  const contour = getContourMoore(mask);

  expect(contour).toStrictEqual([]);
});

test('1 pixel ROI', () => {
  const mask = testUtils.createMask([
    [0, 0, 0],
    [0, 0, 1],
    [0, 0, 0],
  ]);

  const convexHull = getContourMoore(mask);

  expect(convexHull).toBeDeepCloseTo([{ column: 2, row: 1 }]);
});

test('horizontal line', () => {
  const testMask = testUtils.createMask([
    [0, 0, 0],
    [0, 1, 1],
    [0, 0, 0],
  ]);
  const points = getContourMoore(testMask);

  expect(points).toStrictEqual([
    { column: 1, row: 1 },
    { column: 2, row: 1 },
  ]);
});

test('vertical line', () => {
  const testMask = testUtils.createMask([
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ]);
  const points = getContourMoore(testMask);

  expect(points).toStrictEqual([
    { column: 1, row: 0 },
    { column: 1, row: 1 },
    { column: 1, row: 2 },
  ]);
});

test('cross', () => {
  const testMask = testUtils.createMask([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);
  const points = getContourMoore(testMask);

  expect(points).toStrictEqual([
    { column: 1, row: 0 },
    { column: 2, row: 1 },
    { column: 1, row: 2 },
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
  const points = getContourMoore(mask);

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

test('5x6 mask with hole', () => {
  const mask = testUtils.createMask([
    [1, 0, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 1],
    [1, 1, 1, 1, 0],
  ]);
  const points = getContourMoore(mask);

  const bordersMask = Mask.fromPoints(mask.width, mask.height, points);

  expect(bordersMask).toMatchMaskData([
    [1, 0, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 1],
    [1, 1, 1, 1, 0],
  ]);
});
