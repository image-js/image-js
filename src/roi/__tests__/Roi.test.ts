import { fromMask } from '../fromMask';

describe('Roi', () => {
  it('getRatio', () => {
    const mask = testUtils.createMask([
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const rois = roiMapManager.getRois();
    expect(rois[0].getRatio()).toBe(3 / 2);
  });
});
