import { Mask } from '../../Mask';

test('3x3 mask', () => {
  const mask = testUtils.createMask([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);

  let points = mask.getBorderPoints();

  let bordersMask = Mask.fromPoints(mask.width, mask.height, points);

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
  let points = mask.getBorderPoints({ innerBorders: false });

  let bordersMask = Mask.fromPoints(mask.width, mask.height, points);

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

  let points = mask.getBorderPoints({
    innerBorders: true,
    allowCorners: true,
  });

  let bordersMask = Mask.fromPoints(mask.width, mask.height, points);
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
  let points = mask.getBorderPoints({ innerBorders: true });

  let bordersMask = Mask.fromPoints(mask.width, mask.height, points);

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
  let points = mask.getBorderPoints({ allowCorners: true });

  let bordersMask = Mask.fromPoints(mask.width, mask.height, points);

  expect(bordersMask).toMatchMask(mask);
});
