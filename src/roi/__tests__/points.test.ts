import { fromMask } from '..';

test('points 1st test', () => {
  const mask = testUtils.createMask([
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();
  expect(rois[0].points).toStrictEqual([
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
    [0, 2],
    [1, 2],
    [0, 3],
    [1, 3],
  ]);
});

test('points 2nd test', () => {
  const mask = testUtils.createMask([
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [0, 0, 1, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();

  expect(rois[0].points).toStrictEqual([
    [2, 0],
    [1, 1],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [2, 3],
  ]);
});
