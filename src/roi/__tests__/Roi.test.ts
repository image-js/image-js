import { expect, test } from 'vitest';

import { fromMask } from '../fromMask.js';

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
  // @ts-expect-error the map property is private
  const result = rois[0].map.data;

  const expected = new Int32Array([-1, 1, -3, 1, 1, 1, -2, -2, -2]);

  expect(result).toStrictEqual(expected);
});
