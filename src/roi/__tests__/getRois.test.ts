import { fromMask } from '..';
import { Roi } from '../Roi';
import { getRois, RoiKind } from '../getRois';

test('1x2 mask', () => {
  const mask = testUtils.createMask([[1, 0]]);
  const roiMapManager = fromMask(mask);
  const rois = getRois(roiMapManager);

  const roi = new Roi(roiMapManager.getMap(), 1);
  roi.origin = { row: 0, column: 0 };
  roi.height = 1;
  roi.width = 1;
  roi.surface = 1;

  expect(rois).toHaveLength(1);
  expect(rois).toStrictEqual([roi]);
});

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
