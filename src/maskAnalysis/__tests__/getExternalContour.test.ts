import { expect, test } from 'vitest';

import { Mask } from '../../Mask.ts';
import { getExternalContour } from '../getExternalContour.js';

test('simple test', () => {
  const testMask = testUtils.createMask([
    [0, 0, 0],
    [0, 1, 1],
    [0, 0, 0],
  ]);
  const points = getExternalContour(testMask);

  expect(points).toStrictEqual([
    { column: 1, row: 1 },
    { column: 2, row: 1 },
  ]);
});

test('simple test with Pavlidis', () => {
  const testMask = testUtils.createMask([
    [0, 0, 0],
    [0, 1, 1],
    [0, 0, 0],
  ]);
  const points = getExternalContour(testMask, { connectivity: 4 });

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
  const points = getExternalContour(testMask);

  expect(points).toStrictEqual([
    { column: 1, row: 0 },
    { column: 1, row: 1 },
    { column: 1, row: 2 },
  ]);
});

test('vertical line with Pavlidis', () => {
  const testMask = testUtils.createMask([
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ]);
  const points = getExternalContour(testMask, { connectivity: 4 });

  expect(points).toStrictEqual([
    { column: 1, row: 0 },
    { column: 1, row: 1 },
    { column: 1, row: 2 },
  ]);
});

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

test('cross', () => {
  const testMask = testUtils.createMask([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);
  const points = getExternalContour(testMask);

  expect(points).toStrictEqual([
    { column: 1, row: 0 },
    { column: 2, row: 1 },
    { column: 1, row: 2 },
    { column: 0, row: 1 },
  ]);
});

test('1 pixel ROI', () => {
  const mask = testUtils.createMask([
    [0, 0, 0],
    [0, 0, 1],
    [0, 0, 0],
  ]);

  const convexHull = getExternalContour(mask);

  expect(convexHull).toBeDeepCloseTo([{ column: 2, row: 1 }]);
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

test('random shape with Pavlidis', () => {
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

test('empty mask', () => {
  const mask = testUtils.createMask([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);

  const contour = getExternalContour(mask);

  expect(contour).toStrictEqual([]);
});

test('empty mask with Pavlidis', () => {
  const mask = testUtils.createMask([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);

  const contour = getExternalContour(mask, { connectivity: 4 });

  expect(contour).toStrictEqual([]);
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
