import { expect, test } from 'vitest';

import { fromMask } from '../fromMask.js';

test('holes surface and number of holes 4x4', () => {
  const mask = testUtils.createMask([
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ]);

  const rois = fromMask(mask).getRois();

  expect(rois[0].holesInfo.surface).toBe(2);
  expect(rois[0].holesInfo.number).toBe(1);
});

test('holes surface and number of holes 4x5', () => {
  const mask = testUtils.createMask([
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 0, 1],
    [0, 1, 1, 1, 1],
  ]);

  const rois = fromMask(mask).getRois();

  expect(rois[0].holesInfo.number).toBe(2);
  expect(rois[0].holesInfo.surface).toBe(4);
});
