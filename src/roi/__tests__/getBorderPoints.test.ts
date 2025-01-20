import { Mask } from '../../Mask.js';

test('6x5 mask with hole, no inner borders', () => {
  const roi = testUtils.createRoi([
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ]);

  const points = roi.getBorderPoints();

  const bordersMask = Mask.fromPoints(roi.width, roi.height, points);

  expect(bordersMask).toMatchMaskData([
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 1],
  ]);
});
