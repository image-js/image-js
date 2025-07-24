import { expect, test } from 'vitest';

test('Uint8 to Uint16', () => {
  const img = testUtils.createGreyImage([
    [1, 2],
    [3, 4],
  ]);

  const newImg = img.convertBitDepth(16);

  expect(newImg.width).toBe(2);
  expect(newImg.height).toBe(2);
  expect(newImg.bitDepth).toBe(16);
  expect(newImg.colorModel).toBe('GREY');
  expect(newImg).toMatchImageData([
    [256, 512],
    [768, 1024],
  ]);
});

test('Uint16 to Uint8', () => {
  const img = testUtils.createGreyImage(
    [
      [30, 260],
      [512, 2047],
    ],
    { bitDepth: 16 },
  );

  const newImg = img.convertBitDepth(8);

  expect(newImg.width).toBe(2);
  expect(newImg.height).toBe(2);
  expect(newImg.bitDepth).toBe(8);
  expect(newImg.colorModel).toBe('GREY');
  expect(newImg).toMatchImageData([
    [0, 1],
    [2, 7],
  ]);
});

test('Uint16 to Uint8 for rgba', () => {
  const img = testUtils.createRgbaImage(
    [
      [256, 256, 256, 256, 512, 512, 512, 512],
      [768, 768, 768, 768, 1024, 1024, 1024, 1024],
    ],
    { bitDepth: 16 },
  );

  const newImg = img.convertBitDepth(8);

  expect(newImg.width).toBe(2);
  expect(newImg.height).toBe(2);
  expect(newImg.colorModel).toBe('RGBA');
  expect(newImg.bitDepth).toBe(8);
  expect(newImg).toMatchImageData([
    [1, 1, 1, 1, 2, 2, 2, 2],
    [3, 3, 3, 3, 4, 4, 4, 4],
  ]);
});

test('throw if converting to same bit depth', () => {
  const img = testUtils.createRgbaImage([
    [256, 256, 256, 256, 512, 512, 512, 512],
    [768, 768, 768, 768, 1024, 1024, 1024, 1024],
  ]);

  expect(() => {
    img.convertBitDepth(8);
  }).toThrow('cannot convert image to same bitDepth');
});

test('throw if converting to unsupported bit depth', () => {
  const img = testUtils.createRgbaImage([
    [256, 256, 256, 256, 512, 512, 512, 512],
    [768, 768, 768, 768, 1024, 1024, 1024, 1024],
  ]);

  expect(() => {
    img.convertBitDepth(1);
  }).toThrow('This image bit depth is not supported: 1');
});
