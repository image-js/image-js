import { expect, test } from 'vitest';

import { RoiMapManager } from '../RoiMapManager.js';
import { computeRois } from '../computeRois.js';
import { fromMask } from '../fromMask.js';
import { waterShed } from '../waterShed.js';

test('3x3 mask', () => {
  const mask = testUtils.createMask([
    [1, 1, 1],
    [1, 0, 0],
    [0, 0, 1],
  ]);
  const roiMapManager = fromMask(mask);
  computeRois(roiMapManager);

  expect(roiMapManager.whiteRois).toHaveLength(2);
  expect(roiMapManager.blackRois).toHaveLength(1);

  expect(roiMapManager.whiteRois).toMatchSnapshot();
  expect(roiMapManager.blackRois).toMatchSnapshot();
});

test('test 2, waterShed for a grey image', () => {
  const image = testUtils.createGreyImage([
    [3, 3, 3, 3, 3, 3, 3, 3, 4, 4],
    [3, 3, 2, 2, 2, 3, 3, 3, 4, 4],
    [4, 3, 2, 1, 2, 2, 3, 3, 4, 4],
    [4, 3, 2, 2, 2, 2, 3, 3, 3, 4],
    [4, 4, 4, 3, 2, 3, 2, 3, 3, 4],
    [4, 4, 4, 3, 3, 3, 3, 1, 3, 3],
    [4, 3, 3, 3, 3, 3, 2, 2, 2, 3],
    [4, 4, 3, 3, 3, 3, 2, 2, 2, 2],
    [4, 4, 4, 4, 3, 2, 2, 2, 2, 3],
    [4, 4, 4, 4, 3, 3, 3, 3, 2, 3],
  ]);

  const roiMapManager = waterShed(image, { threshold: 2 / 255 });

  const result = new RoiMapManager({
    data: testUtils.getInt32Array(`
           0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
           0,  0, -1, -1, -1,  0,  0,  0,  0,  0,
           0,  0, -1, -1, -1, -1,  0,  0,  0,  0,
           0,  0, -1, -1, -1, -1,  0,  0,  0,  0,
           0,  0,  0,  0, -1,  0,  0,  0,  0,  0,
           0,  0,  0,  0,  0,  0,  0, -2,  0,  0,
           0,  0,  0,  0,  0,  0, -2, -2, -2,  0,
           0,  0,  0,  0,  0,  0, -2, -2, -2, -2,
           0,  0,  0,  0,  0, -2, -2, -2, -2,  0,
           0,  0,  0,  0,  0,  0,  0,  0, -2,  0
        `),
    nbPositive: 0,
    nbNegative: 2,
    width: 10,
    height: 10,
  });

  expect(roiMapManager).toStrictEqual(result);

  computeRois(roiMapManager);

  expect(roiMapManager.blackRois[0].origin).toStrictEqual({
    column: 2,
    row: 1,
  });
  expect(roiMapManager.blackRois[1].origin).toStrictEqual({
    column: 5,
    row: 5,
  });
});
