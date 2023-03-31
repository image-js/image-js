import { fromMask } from '..';

test('calculates eqpc to Roi', () => {
  const mask = testUtils.createMask([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);
  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois();
  expect(rois[0].eqpc).toBeCloseTo(2.52, 2);
});

test('calculates surface from eqpc', () => {
  const mask = testUtils.createMask([
    [1, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);
  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois();
  const eqpc = rois[0].eqpc;
  const surface = Math.PI * (eqpc / 2) ** 2;
  expect(surface).toBeCloseTo(6);
});
