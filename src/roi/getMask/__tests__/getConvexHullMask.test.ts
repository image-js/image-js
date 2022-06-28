import { fromMask } from '../../fromMask';
import { RoiKind } from '../../getRois';
import { getConvexHullMask } from '../getConvexHullMask';

describe('getConvexHullMask', () => {
  it('cross', () => {
    const mask = testUtils.createMask([
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const roi = roiMapManager.getRois({ kind: RoiKind.WHITE })[0];
    const roiMask = getConvexHullMask(roi);
    expect(roiMask).toMatchMaskData([
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]);
  });
  it('cross, not filled', () => {
    const mask = testUtils.createMask([
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const roi = roiMapManager.getRois({ kind: RoiKind.WHITE })[0];
    const roiMask = getConvexHullMask(roi, {
      kind: 'convexHull',
      filled: false,
    });
    expect(roiMask).toMatchMaskData([
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
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
    const roiMask = getConvexHullMask(roi);
    expect(roiMask).toMatchMaskData([[1]]);
  });
  it('2 pixels ROI', () => {
    const mask = testUtils.createMask([
      [0, 0, 0],
      [0, 1, 1],
      [0, 0, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const roi = roiMapManager.getRois({ kind: RoiKind.WHITE })[0];
    const roiMask = getConvexHullMask(roi);
    expect(roiMask).toMatchMaskData([[1, 1]]);
  });
  it('5x5 cross, filled = false', () => {
    const mask = testUtils.createMask([
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const roi = roiMapManager.getRois({ kind: RoiKind.WHITE })[0];
    const roiMask = getConvexHullMask(roi, {
      kind: 'convexHull',
      filled: false,
    });

    expect(roiMask).toMatchMaskData([
      [0, 0, 1, 0, 0],
      [0, 1, 0, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0],
    ]);
  });
  it('random shape, filled = false', () => {
    const mask = testUtils.createMask([
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 1, 1],
      [0, 1, 0, 0, 0],
      [1, 0, 0, 0, 0],
    ]);
    const roiMapManager = fromMask(mask, { allowCorners: true });

    const roi = roiMapManager.getRois({ kind: RoiKind.WHITE })[0];
    const roiMask = getConvexHullMask(roi, {
      kind: 'convexHull',
      filled: false,
    });

    expect(roiMask).toMatchMaskData([
      [0, 0, 1, 0, 0],
      [0, 0, 1, 1, 0],
      [0, 1, 0, 0, 1],
      [0, 1, 1, 1, 0],
      [1, 1, 0, 0, 0],
    ]);
  });
  it('test fill', () => {
    const mask = testUtils.createMask([
      [1, 1, 1, 1, 1],
      [0, 0, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const roi = roiMapManager.getRois({ kind: RoiKind.WHITE })[0];
    const roiMask = getConvexHullMask(roi);

    expect(roiMask).toMatchMaskData([
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ]);
  });
});
