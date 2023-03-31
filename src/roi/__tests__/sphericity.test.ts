import { fromMask } from '..';

describe('ROI sphericity', () => {
  test('sphericity 1', () => {
    const mask = testUtils.createMask([
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
    ]);
    const roiMapManager = fromMask(mask);
    const rois = roiMapManager.getRois();
    expect(rois[0].sphericity).toBeCloseTo(1.0038, 2);
  });

  test('sphericity 2', () => {
    const mask = testUtils.createMask([
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ]);
    const roiMapManager = fromMask(mask);
    const rois = roiMapManager.getRois();
    expect(rois[0].sphericity).toBeCloseTo(0.9854, 2);
  });

  test('sphericity 3', () => {
    const mask = testUtils.createMask([
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
    ]);
    const roiMapManager = fromMask(mask);
    const rois = roiMapManager.getRois();
    expect(rois[0].sphericity).toBeCloseTo(1.0608, 2);
  });
});
