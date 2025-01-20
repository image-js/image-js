import { fromMask } from '../fromMask.js';

test('fillRatio 4x4', () => {
  const mask = testUtils.createMask([
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ]);

  const rois = fromMask(mask).getRois();
  expect(rois[0].fillRatio).toBeCloseTo(12 / 16, 2);
});

test('fillRatio 4x4 with open borders', () => {
  const mask = testUtils.createMask([
    [0, 1, 1, 1],
    [0, 1, 0, 1],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
  ]);

  const rois = fromMask(mask).getRois();
  expect(rois[0].fillRatio).toBeCloseTo(8 / 9, 2);
});

test('fillRatio 4x4 with open borders', () => {
  const mask = testUtils.createMask([
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ]);

  const rois = fromMask(mask).getRois();
  expect(rois[0].fillRatio).toBeCloseTo(10 / 12, 2);
});
