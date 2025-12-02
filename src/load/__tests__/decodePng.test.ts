import { expect, test } from 'vitest';

import { decodePng } from '../decodePng.js';

const tests = [
  // ['name', components, alpha, bitDepth]
  ['grey8', 8, 'GREY'],
  ['grey16', 16, 'GREY'],
  ['greya16', 8, 'GREYA'],
  ['greya32', 16, 'GREYA'],
  ['rgb24', 8, 'RGB'],
  ['rgb48', 16, 'RGB'],
  ['rgba32', 8, 'RGBA'],
  ['rgba64', 16, 'RGBA'],
  ['plt-4bpp', 8, 'RGB'],
  ['plt-8bpp-color', 8, 'RGB'],
  ['bwImage', 8, 'GREY'],
  ['polishedBasaltSide', 8, 'RGB'],
  ['magicHatTrns', 8, 'RGBA'],
] as const;

test.each(tests)('should load from buffer %s', (name, bitDepth, colorModel) => {
  const buffer = testUtils.loadBuffer(`formats/${name}.png`);
  const img = decodePng(buffer);

  expect(img.bitDepth).toBe(bitDepth);
  expect(img.colorModel).toBe(colorModel);
});

test('should extract image resolution', () => {
  const image = testUtils.load('formats/polishedBasaltSide.png');

  expect(image.meta).toBeUndefined();

  const image2 = testUtils.load('formats/grey8.png');

  expect(image2.originalResolution).toStrictEqual({
    x: 2835,
    y: 2835,
    unit: 'meter',
  });
  expect(image2.normalizedResolution).toStrictEqual({
    x: 28.35,
    y: 28.35,
  });

  const image3 = testUtils.load('formats/grey16.png');

  expect(image3.originalResolution).toStrictEqual({
    x: 2835,
    y: 2835,
    unit: 'meter',
  });
  expect(image3.normalizedResolution).toStrictEqual({
    x: 28.35,
    y: 28.35,
  });

  const image4 = testUtils.load('formats/unspecifiedRes.png');

  expect(image4.originalResolution).toBeDefined();
  expect(image4.originalResolution).toStrictEqual({
    x: 300,
    y: 300,
    unit: 'unknown',
  });
  expect(image4.normalizedResolution).toBeNull();
});
