import { fromMask } from '..';

describe('ROI perimeter', () => {
  test('perimeter', () => {
    const mask = testUtils.createMask([
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 1],
    ]);
    const roiMapManager = fromMask(mask);
    const rois = roiMapManager.getRois();
    expect(rois[0].perimeter).toBeCloseTo(9.656, 2);
  });
  test('perimeter with external borders', () => {
    const mask = testUtils.createMask([
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
    ]);

    const rois = fromMask(mask).getRois();
    expect(rois[0].perimeter).toBeCloseTo(9.656, 2);
  });
  it('perimeter with a hole in ROI', () => {
    const mask = testUtils.createMask([
      [0, 1, 1, 1],
      [0, 1, 0, 1],
      [0, 1, 1, 1],
      [0, 0, 0, 0],
    ]);

    const rois = fromMask(mask).getRois();

    expect(rois[0].perimeter).toBeCloseTo(9.656, 2);
  });
  it('perimeter of ROI surrounded by 4 external sides', () => {
    const mask = testUtils.createMask([
      [0, 1],
      [0, 0],
    ]);

    const rois = fromMask(mask).getRois();
    expect(rois[0].perimeter).toBeCloseTo(3.414, 2);
  });
  it('line', () => {
    const mask = testUtils.createMask([[1], [1], [1], [1]]);

    const rois = fromMask(mask).getRois();
    expect(rois[0].perimeter).toBeCloseTo(6.485, 2);
  });
});
