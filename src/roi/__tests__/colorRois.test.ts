import { expect, test } from 'vitest';

import { colorRois } from '../colorRois.ts';
import { fromMask } from '../fromMask.ts';

test('1x2 mask', () => {
  const mask = testUtils.createMask([[0, 1]]);
  const roiMapManager = fromMask(mask);
  const result = colorRois(roiMapManager);

  expect(result).toMatchImageData([[255, 0, 0, 255, 0, 255, 0, 255]]);
});
