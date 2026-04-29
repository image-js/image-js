import { expect, test } from 'vitest';

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

  const contourMask = Mask.fromPoints(roi.width, roi.height, points);

  expect(contourMask).toMatchMaskData([
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 1],
  ]);
});

test('compare borderPoints and externalContour', () => {
  const roi = testUtils.createRoi([
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ]);

  const contourPoints = roi.getExternalContour();
  const borderPoints = roi.getBorderPoints();
  const contourMask = Mask.fromPoints(roi.width, roi.height, contourPoints);
  const borderMask = Mask.fromPoints(roi.width, roi.height, borderPoints);

  expect(contourMask).toMatchMask(borderMask);
});

test('compare borderPoints and externalContour with different shape', () => {
  const roi = testUtils.createMask([
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
  ]);

  const contourPoints = roi.getExternalContour();
  const borderPoints = roi.getBorderPoints();
  const contourMask = Mask.fromPoints(roi.width, roi.height, contourPoints);
  const borderMask = Mask.fromPoints(roi.width, roi.height, borderPoints);

  expect(contourMask).toMatchMask(borderMask);
});
