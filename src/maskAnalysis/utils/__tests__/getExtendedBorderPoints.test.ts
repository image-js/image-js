import { Mask } from '../../../Mask.js';
import { getExtendedBorderPoints } from '../getExtendedBorderPoints.js';

test('one pixel', () => {
  const mask = testUtils.createMask([[1]]);

  const points = getExtendedBorderPoints(mask);

  const bordersMask = Mask.fromPoints(mask.width + 1, mask.height + 1, points);

  expect(bordersMask).toMatchMaskData([
    [1, 1],
    [1, 1],
  ]);
});

test('2x2 mask, L', () => {
  const mask = testUtils.createMask([
    [1, 0],
    [1, 1],
  ]);

  const points = getExtendedBorderPoints(mask);

  const bordersMask = Mask.fromPoints(mask.width + 1, mask.height + 1, points);

  expect(bordersMask).toMatchMaskData([
    [1, 1, 0],
    [1, 1, 1],
    [1, 1, 1],
  ]);
});

test('3x3 mask, cross', () => {
  const mask = testUtils.createMask([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);

  const points = getExtendedBorderPoints(mask);

  const extendedBorders = Mask.fromPoints(
    mask.width + 1,
    mask.height + 1,
    points,
  );

  expect(extendedBorders).toMatchMaskData([
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [0, 1, 1, 0],
  ]);
});
