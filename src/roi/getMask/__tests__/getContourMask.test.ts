import { fromMask } from '../../fromMask';
import { RoiKind } from '../../getRois';
import { getContourMask } from '../getContourMask';

describe('getContourMask', () => {
  it('cross', () => {
    const mask = testUtils.createMask([
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const roi = roiMapManager.getRois({ kind: RoiKind.WHITE })[0];
    const roiMask = getContourMask(roi);
    expect(roiMask).toMatchMask(mask);
  });
  it('L', () => {
    const mask = testUtils.createMask([
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const roi = roiMapManager.getRois({ kind: RoiKind.WHITE })[0];
    const roiMask = getContourMask(roi);

    expect(roiMask).toMatchMaskData([
      [1, 0],
      [1, 1],
    ]);
  });
  it('1 pixel ROI', () => {
    const mask = testUtils.createMask([
      [0, 0, 0],
      [0, 0, 1],
      [0, 0, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const roi = roiMapManager.getRois({ kind: RoiKind.WHITE })[0];
    const roiMask = getContourMask(roi);

    expect(roiMask).toMatchMaskData([[1]]);
  });
  it('filled = false', () => {
    const mask = testUtils.createMask([
      [0, 1, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 1],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const roi = roiMapManager.getRois({ kind: RoiKind.WHITE })[0];
    const roiMask = getContourMask(roi, { kind: 'contour', filled: false });

    expect(roiMask).toMatchMaskData([
      [1, 1, 0, 0],
      [1, 0, 1, 0],
      [1, 0, 0, 1],
      [1, 1, 1, 1],
    ]);
  });
  it('test fill', () => {
    const mask = testUtils.createMask([
      [0, 1, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 1],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const roi = roiMapManager.getRois({ kind: RoiKind.WHITE })[0];
    const roiMask = getContourMask(roi);

    expect(roiMask).toMatchMaskData([
      [1, 1, 0, 0],
      [1, 1, 1, 0],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ]);
  });
  it('test innerBorders false', () => {
    const mask = testUtils.createMask([
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ]);
    const roiMapManager = fromMask(mask);

    const roi = roiMapManager.getRois({ kind: RoiKind.WHITE })[0];
    const roiMask = getContourMask(roi, {
      kind: 'contour',
      innerBorders: false,
    });

    expect(roiMask).toMatchMaskData([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);
  });
  it('test innerBorders true', () => {
    const mask = testUtils.createMask([
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ]);
    const roiMapManager = fromMask(mask);

    const roi = roiMapManager.getRois({ kind: RoiKind.WHITE })[0];
    const roiMask = getContourMask(roi, {
      kind: 'contour',
      innerBorders: true,
    });

    expect(roiMask).toMatchMaskData([
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ]);
  });
  it('larger mask, innerBorders false', () => {
    const mask = testUtils.createMask([
      [0, 1, 1, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [0, 1, 1, 1, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const roi = roiMapManager.getRois({ kind: RoiKind.WHITE })[0];
    const roiMask = getContourMask(roi, {
      kind: 'contour',
      innerBorders: false,
    });

    expect(roiMask).toMatchMaskData([
      [0, 1, 1, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
    ]);
  });
  it('test allowCorners true', () => {
    const mask = testUtils.createMask([
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 1],
    ]);
    const roiMapManager = fromMask(mask);

    const roi = roiMapManager.getRois({ kind: RoiKind.WHITE })[0];
    const roiMask = getContourMask(roi, {
      kind: 'contour',
      allowCorners: true,
      innerBorders: true,
    });

    console.log(mask);
    expect(roiMask).toMatchMaskData([
      [1, 1, 1],
      [1, 1, 1],
      [0, 1, 1],
    ]);
  });
});
