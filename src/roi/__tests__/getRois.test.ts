import { fromMask } from '..';
import { getRois, RoiKind } from '../getRois';

test('3x3 mask, kind BLACK', () => {
  const mask = testUtils.createMask([
    [1, 1, 1],
    [1, 0, 0],
    [0, 0, 1],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = getRois(roiMapManager, { kind: RoiKind.BLACK });
  expect(rois).toHaveLength(1);
  expect(rois[0].surface).toBe(4);
  expect(rois[0].id).toBe(-1);
});

test('3x3 mask, kind BW', () => {
  const mask = testUtils.createMask([
    [1, 1, 1],
    [1, 0, 0],
    [0, 0, 1],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = getRois(roiMapManager, { kind: RoiKind.BW });
  expect(rois).toHaveLength(3);
  expect(rois[0].surface).toBe(4);
  expect(rois[0].id).toBe(1);
});

test('3x3 mask, minSurface = 2', () => {
  const mask = testUtils.createMask([
    [1, 1, 1],
    [1, 0, 0],
    [0, 0, 1],
  ]);
  const roiMapManager = fromMask(mask);

  const rois = getRois(roiMapManager, { minSurface: 2 });
  expect(rois).toHaveLength(1);
  expect(rois[0].surface).toBe(4);
  expect(rois[0].id).toBe(1);
});
