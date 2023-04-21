import { fromMask, RoiKind } from '../..';

test('border lengths property 5x5', () => {
  const mask = testUtils.createMask([
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 1, 1, 0, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();

  expect(rois[0].borders).toStrictEqual([
    { connectedID: -1, length: 2 },
    { connectedID: -2, length: 7 },
  ]);
});

test.skip.failing('border lengths property 4x4', () => {
  const mask = testUtils.createMask([
    [0, 1, 1, 1],
    [0, 1, 0, 1],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
  ]);

  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois({ kind: RoiKind.BW });

  expect(rois[0].borders[0]).toStrictEqual({ connectedID: -1, length: 6 });
});

test('border lengths property 4x4', () => {
  const mask = testUtils.createMask([
    [1, 0, 1, 1],
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();

  expect(rois[0].borders).toStrictEqual([
    { connectedID: -2, length: 2 },
    { connectedID: -1, length: 1 },
  ]);
  expect(rois[1].borders).toStrictEqual([
    { connectedID: -2, length: 2 },
    { connectedID: -1, length: 2 },
  ]);
  expect(rois[0].borders[0].length).toStrictEqual(2);
});
