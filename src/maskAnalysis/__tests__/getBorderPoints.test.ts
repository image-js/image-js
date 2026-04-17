import { expect, test } from 'vitest';

import { Mask } from '../../Mask.js';

test('3x3 mask', () => {
  const mask = testUtils.createMask([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);

  const points = mask.getBorderPoints();

  const bordersMask = Mask.fromPoints(mask.width, mask.height, points);

  expect(bordersMask).toMatchMaskData([
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
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
  const points = mask.getBorderPoints({ innerBorders: false });

  const bordersMask = Mask.fromPoints(mask.width, mask.height, points);

  expect(points).toStrictEqual([
    { column: 0, row: 1 },
    { column: 1, row: 1 },
    { column: 2, row: 1 },
    { column: 3, row: 1 },
    { column: 4, row: 1 },
    { column: 3, row: 2 },
    { column: 3, row: 3 },
    { column: 4, row: 4 },
    { column: 3, row: 4 },
    { column: 2, row: 4 },
    { column: 1, row: 4 },
    { column: 1, row: 3 },
    { column: 1, row: 2 },
  ]);
  expect(bordersMask).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ]);
});

test('5x5 mask with hole, inner borders, allow corners', () => {
  const mask = testUtils.createMask([
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
  ]);

  const points = mask.getBorderPoints({
    innerBorders: true,
    allowCorners: true,
  });
  const bordersMask = Mask.fromPoints(mask.width, mask.height, points);

  expect(points).toStrictEqual([
    { column: 0, row: 0 },
    { column: 1, row: 0 },
    { column: 2, row: 0 },
    { column: 3, row: 0 },
    { column: 4, row: 0 },
    { column: 4, row: 1 },
    { column: 4, row: 2 },
    { column: 4, row: 3 },
    { column: 4, row: 4 },
    { column: 3, row: 4 },
    { column: 2, row: 4 },
    { column: 1, row: 4 },
    { column: 0, row: 4 },
    { column: 0, row: 3 },
    { column: 0, row: 2 },
    { column: 0, row: 1 },
    { column: 1, row: 1 },
    { column: 2, row: 1 },
    { column: 1, row: 2 },
    { column: 1, row: 3 },
    { column: 2, row: 3 },
    { column: 3, row: 3 },
    { column: 3, row: 2 },
    { column: 3, row: 1 },
  ]);
  expect(bordersMask).toMatchMask(mask);
});

test('5x6 mask with hole, inner borders', () => {
  const mask = testUtils.createMask([
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0],
  ]);
  const points = mask.getBorderPoints({ innerBorders: true });

  const bordersMask = Mask.fromPoints(mask.width, mask.height, points);

  expect(bordersMask).toMatchMaskData([
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 0],
    [1, 0, 1, 1, 0],
    [1, 1, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ]);
  expect(points).toHaveLength(19);
});
