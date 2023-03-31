import { fromMask } from '..';

describe('ROI solidity', () => {
  it('solidity 1', () => {
    const mask = testUtils.createMask([
      [1, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
    ]);
    const roiMapManager = fromMask(mask);
    const rois = roiMapManager.getRois();
    expect(rois[0].solidity).toBeCloseTo(0.8571, 2);
  });

  it('solidity 2', () => {
    const mask = testUtils.createMask([
      [1, 1, 1, 0],
      [1, 1, 1, 1],
      [1, 1, 1, 0],
      [0, 1, 1, 0],
    ]);
    const roiMapManager = fromMask(mask);
    const rois = roiMapManager.getRois();
    expect(rois[0].solidity).toBeCloseTo(0.8571, 2);
  });
});
