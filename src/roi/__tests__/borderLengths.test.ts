import { fromMask } from '../..';

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
  expect(rois[0].borderLengths).toStrictEqual([2, 7]);
});

test('border lengths property 4x4', () => {
  const mask = testUtils.createMask([
    [0, 1, 1, 1],
    [0, 1, 0, 1],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();

  expect(rois[0].borderLengths).toStrictEqual([6, 1]);
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
  expect(rois[0].borderLengths).toStrictEqual([2, 1]);
  expect(rois[1].borderLengths).toStrictEqual([2, 2]);
});
