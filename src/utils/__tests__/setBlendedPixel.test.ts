import { expect, test } from 'vitest';

import { setBlendedPixel } from '../setBlendedPixel.js';

test('GREYA image, default options', () => {
  const image = testUtils.createGreyaImage([
    [50, 255],
    [20, 30],
  ]);
  setBlendedPixel(image, 0, 1);

  expect(image).toMatchImageData([
    [50, 255],
    [0, 255],
  ]);
});

test('GREYA images: transparent source, opaque target', () => {
  const image = testUtils.createGreyaImage([[50, 255]]);
  setBlendedPixel(image, 0, 0, [100, 0]);

  expect(image).toMatchImageData([[50, 255]]);
});

test('GREYA images: opaque source, transparent target', () => {
  const image = testUtils.createGreyaImage([[50, 0]]);
  setBlendedPixel(image, 0, 0, [100, 255]);

  expect(image).toMatchImageData([[100, 255]]);
});

test('asymetrical test', () => {
  const image = testUtils.createGreyaImage([
    [50, 255, 1, 2, 3, 4],
    [20, 30, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6],
  ]);
  setBlendedPixel(image, 2, 0, [0, 125]);

  expect(image).toMatchImageData([
    [50, 255, 1, 2, 0, 127],
    [20, 30, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6],
  ]);
});

test('2x2 mask, default options', () => {
  const mask = testUtils.createMask([
    [1, 0],
    [0, 0],
  ]);
  setBlendedPixel(mask, 1, 0);

  expect(mask).toMatchMask(mask);
});

test('2x2 mask, color is 1', () => {
  const mask = testUtils.createMask([
    [1, 0],
    [0, 0],
  ]);
  setBlendedPixel(mask, 1, 0, [1]);

  expect(mask).toMatchMaskData([
    [1, 1],
    [0, 0],
  ]);
});
