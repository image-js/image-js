import { Mask } from '../../Mask';
import { fromMask } from '../fromMask';
import { RoiKind } from '../getRois';

describe('getBorderPoints', () => {
  it('3x3 mask', () => {
    const mask = testUtils.createMask([
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const rois = roiMapManager.getRois({ kind: RoiKind.WHITE });
    const roi = rois[0];

    let points = roi.getBorderPoints();

    let bordersMask = Mask.fromPoints(roi.width, roi.height, points);

    expect(bordersMask).toMatchMaskData([
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ]);
  });
  it('6x5 mask with hole, no inner borders', () => {
    const mask = testUtils.createMask([
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const rois = roiMapManager.getRois({ kind: RoiKind.WHITE });
    const roi = rois[0];

    let points = roi.getBorderPoints();

    let bordersMask = Mask.fromPoints(roi.width, roi.height, points);

    expect(bordersMask).toMatchMaskData([
      [1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 1],
    ]);
  });
  it('5x5 mask with hole, inner borders, allow corners', () => {
    const mask = testUtils.createMask([
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
    ]);
    const roiMapManager = fromMask(mask);

    const rois = roiMapManager.getRois({ kind: RoiKind.WHITE });
    const roi = rois[0];

    let points = roi.getBorderPoints({
      innerBorders: true,
      allowCorners: true,
    });

    let bordersMask = Mask.fromPoints(roi.width, roi.height, points);
    expect(bordersMask).toMatchMask(mask);
  });
  it('6x5 mask with hole, inner borders', () => {
    const mask = testUtils.createMask([
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0],
      [1, 0, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const rois = roiMapManager.getRois({ kind: RoiKind.WHITE });
    const roi = rois[0];

    let points = roi.getBorderPoints({ innerBorders: true });

    let bordersMask = Mask.fromPoints(roi.width, roi.height, points);

    expect(bordersMask).toMatchMaskData([
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 0],
      [1, 0, 1, 1, 0],
      [1, 1, 0, 0, 1],
      [1, 1, 1, 1, 0],
    ]);
  });
  it('6x5 mask with hole, allowCorners', () => {
    const mask = testUtils.createMask([
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const rois = roiMapManager.getRois({ kind: RoiKind.WHITE });
    const roi = rois[0];

    let points = roi.getBorderPoints({ allowCorners: true });

    let bordersMask = Mask.fromPoints(roi.width, roi.height, points);

    expect(bordersMask).toMatchMask(mask);
  });
});
