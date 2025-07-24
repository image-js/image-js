import { expect, test } from 'vitest';

import { decode } from '../../load/decode.js';
import { encodeJpeg } from '../encodeJpeg.js';

test('encode an 8-bit rgba image', () => {
  const image = testUtils.createRgbaImage([
    [1, 1, 1, 255, 2, 2, 2, 255],
    [3, 3, 3, 255, 4, 4, 4, 255],
  ]);

  const encoded = encodeJpeg(image);

  const reloaded = decode(encoded);

  expect(reloaded.width).toBe(2);
  expect(reloaded.height).toBe(2);
  expect(reloaded.colorModel).toBe('RGBA');
  expect(reloaded.bitDepth).toBe(8);
});

test('decode the encoded jpeg returns image with same characteristics', () => {
  const image = testUtils.load('formats/rgb6.jpg');
  const encoded = encodeJpeg(image);
  const reloadedImage = decode(encoded);

  expect(image.width).toStrictEqual(reloadedImage.width);
  expect(image.height).toStrictEqual(reloadedImage.height);
  expect(image.colorModel).toStrictEqual(reloadedImage.colorModel);
});

test('encoding a 16-bit image should convert it to a 8-bit image', () => {
  const image = testUtils.createGreyImage(
    [
      [256, 512],
      [768, 1024],
    ],
    { bitDepth: 16 },
  );
  const encoded = encodeJpeg(image);
  const reloaded = decode(encoded);

  expect(reloaded.width).toBe(2);
  expect(reloaded.height).toBe(2);
  expect(reloaded.colorModel).toBe('RGBA');
  expect(reloaded.bitDepth).toBe(8);
});
