import { expect, test } from 'vitest';

import { decodeTiff } from '../decodeTiff.js';

const tests = [
  // ['name', components, alpha, bitDepth]
  ['grey8', 'GREY', 8],
  ['grey16', 'GREY', 16],
  ['greya16', 'GREYA', 8],
  ['greya32', 'GREYA', 16],
  ['rgba8', 'RGBA', 8],
  ['rgb16', 'RGB', 16],
  ['palette', 'RGB', 16],
  ['bw1bit', 'GREY', 8],
  ['palette_alpha', 'RGBA', 16],
] as const;

test.each(tests)('%s', (name, colorModel, bitDepth) => {
  const buffer = testUtils.loadBuffer(`formats/tif/${name}.tif`);
  const img = decodeTiff(buffer);

  expect(img.colorModel).toBe(colorModel);
  expect(img.bitDepth).toBe(bitDepth);
});

test('should decode image resolution', () => {
  const img = testUtils.load('formats/tif/dog.tif');

  expect(img.normalizedResolution).toBeUndefined();

  const img2 = testUtils.load('formats/tif/grey8-multi.tif');

  expect(img2.originalResolution).toStrictEqual({
    x: 72,
    y: 72,
    unit: 'inch',
  });
  expect(img2.normalizedResolution).toStrictEqual({
    x: 28.346456692913385,
    y: 28.346456692913385,
  });
});
