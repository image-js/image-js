import { fromMask } from '../fromMask';
import { MaskKind } from '../getMask';
import { RoiKind } from '../getRois';

describe('getMask', () => {
  it('kind = FILLED, 3x3 mask, cross', () => {
    const mask = testUtils.createMask([
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const rois = roiMapManager.getRois({ kind: RoiKind.WHITE });
    const roiMask = rois[0].getMask();
    expect(roiMask).toMatchMask(mask);
  });
  it('kind = FILLED, 3x3 mask, L', () => {
    const mask = testUtils.createMask([
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const rois = roiMapManager.getRois({ kind: RoiKind.WHITE });
    const roiMask = rois[0].getMask();

    expect(roiMask).toMatchMaskData([
      [1, 0],
      [1, 1],
    ]);
  });
  it('kind = FILLED, 3x3 mask, 1 pixel ROI', () => {
    const mask = testUtils.createMask([
      [0, 0, 0],
      [0, 0, 1],
      [0, 0, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const rois = roiMapManager.getRois({ kind: RoiKind.WHITE });
    const roiMask = rois[0].getMask();

    expect(roiMask).toMatchMaskData([[1]]);
  });
  it('kind = BORDER, 5x5 mask', () => {
    const mask = testUtils.createMask([
      [0, 1, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 1],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const rois = roiMapManager.getRois({ kind: RoiKind.WHITE });
    const roiMask = rois[0].getMask({ kind: MaskKind.BORDER });

    expect(roiMask).toMatchMaskData([
      [1, 1, 0, 0],
      [1, 0, 1, 0],
      [1, 0, 0, 1],
      [1, 1, 1, 1],
    ]);
  });
  it('kind = HULL, 3x3 mask, L', () => {
    const mask = testUtils.createMask([
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const rois = roiMapManager.getRois({ kind: RoiKind.WHITE });
    const roiMask = rois[0].getMask({ kind: MaskKind.CONVEX_HULL });

    expect(roiMask).toMatchMaskData([
      [1, 0],
      [1, 1],
    ]);
  });
});
