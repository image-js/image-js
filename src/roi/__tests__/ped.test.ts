import { fromMask } from '../fromMask.js';

test('calculates ped from roi', () => {
  const mask = testUtils.createMask([
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ]);
  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois();
  expect(rois[0].ped).toBeCloseTo(3.07);
});
