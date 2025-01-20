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

test('6x5 mask with hole, no inner borders', () => {
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
  expect(bordersMask).toMatchMask(mask);
});

test('6x5 mask with hole, inner borders', () => {
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
});

test('6x5 mask with hole, allowCorners', () => {
  const mask = testUtils.createMask([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);
  const points = mask.getBorderPoints({ allowCorners: true });

  const bordersMask = Mask.fromPoints(mask.width, mask.height, points);

  expect(bordersMask).toMatchMask(mask);
});
