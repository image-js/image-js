import { fromMask } from '..';

test('roundness 1 ', () => {
  const mask = testUtils.createMask([
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();
  expect(rois[0].roundness).toBeCloseTo(0.5092, 2);
});

test('roundness 2', () => {
  const mask = testUtils.createMask([
    [1, 1, 1, 0],
    [1, 1, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();
  expect(rois[0].roundness).toBeCloseTo(0.42441, 2);
});
