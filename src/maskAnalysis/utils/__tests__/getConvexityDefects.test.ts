import { expect, test } from 'vitest';

import { getConvexityDefects } from '../../getConvexityDefects.ts';

test('basic test', () => {
  const mask = testUtils.createMask([
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
  ]);

  const borderPoints = mask.getExternalContour();
  const convexHull = mask.getConvexHull();
  const defects = getConvexityDefects(borderPoints, convexHull.points, {
    depthThreshold: 1,
  });

  expect(defects).toHaveLength(4);
  expect(defects).toStrictEqual([
    { column: 4, row: 2 },
    { column: 5, row: 4 },
    { column: 2, row: 5 },
    { column: 2, row: 2 },
  ]);
});

test('carton mask', () => {
  const image = testUtils.load('various/carton.png');
  const mask = image.threshold();
  const borderPoints = mask.getExternalContour();
  const convexHull = mask.getConvexHull();
  const defects = getConvexityDefects(borderPoints, convexHull.points, {
    depthThreshold: 100,
  });

  expect(defects).toHaveLength(3);
  expect(defects).toStrictEqual([
    { column: 226, row: 146 },
    { column: 340, row: 150 },
    { column: 116, row: 475 },
  ]);
});

// Current convexity defects implementation doesn't really support contours as
// masks.
test.todo('contour test', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ]);

  const borderPoints = mask.getExternalContour();
  const convexHull = mask.getConvexHull();
  const defects = getConvexityDefects(borderPoints, convexHull.points, {
    depthThreshold: 1,
  });

  expect(defects).toHaveLength(4);
  expect(defects).toStrictEqual([
    { column: 2, row: 3 },
    { column: 3, row: 2 },
    { column: 4, row: 3 },
    { column: 3, row: 4 },
  ]);
});
