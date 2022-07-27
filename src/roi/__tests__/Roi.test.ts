import { fromMask } from '../fromMask';

test('getRatio', () => {
  const mask = testUtils.createMask([
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ]);
  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois();
  expect(rois[0].getRatio()).toBe(3 / 2);
});

test('getMap', () => {
  const mask = testUtils.createMask([
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ]);
  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois();
  const result = rois[0].getMap().data;
  const expected = new Int16Array([-1, 1, -3, 1, 1, 1, -2, -2, -2]);
  expect(result).toStrictEqual(expected);
});
