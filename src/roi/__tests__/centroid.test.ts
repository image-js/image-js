import { fromMask } from '../..';

test('centroid property 4x4', () => {
  const mask = testUtils.createMask([
    [0, 1, 1, 1],
    [0, 1, 0, 1],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();
  expect(rois[0].centroid).toStrictEqual({ row: 1, column: 2 });
});

test('border lengths property 5x5', () => {
  const mask = testUtils.createMask([
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 1, 1, 0, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();
  expect(rois[0].centroid.row).toBeCloseTo(2.14286);
  expect(rois[0].centroid.column).toBeCloseTo(1.28571);
});

test('border lengths property 5x5', () => {
  const mask = testUtils.createMask([
    [1, 1, 1],
    [0, 1, 0],
    [1, 1, 1],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();
  expect(rois[0].centroid.row).toBeCloseTo(1);
  expect(rois[0].centroid.column).toBeCloseTo(1);
});
