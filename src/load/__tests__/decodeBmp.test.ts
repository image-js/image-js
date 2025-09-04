import { expect, test } from 'vitest';

import { decodeBmp } from '../decodeBmp.js';

test('should decode RGBA image', () => {
  const result = decodeBmp(testUtils.loadBuffer('formats/bmp/2x2RGBA.bmp'));

  expect(result.channels).toBe(4);
  expect(result.components).toBe(3);
  expect(result.getRawImage().data).toStrictEqual(
    new Uint8Array(
      [
        [255, 0, 0, 255, 0, 255, 0, 255],
        [0, 0, 255, 255, 255, 255, 255, 255],
      ].flat(),
    ),
  );
});

test('should decode grey image', () => {
  const result = decodeBmp(testUtils.loadBuffer('formats/bmp/gray5x5.bmp'));

  expect(result.channels).toBe(1);
  expect(result.components).toBe(1);

  expect(result.getRawImage().data).toStrictEqual(
    new Uint8Array(
      [
        [246, 246, 173, 0, 0],
        [255, 255, 182, 113, 113],
        [214, 214, 206, 246, 246],
        [0, 0, 173, 255, 255],
        [0, 0, 157, 214, 214],
      ].flat(),
    ),
  );
});

test('decode 5x5 mask', () => {
  const mask = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 0, 255, 0],
    [0, 255, 255, 255, 0],
    [255, 0, 255, 0, 255],
  ]);

  const result = decodeBmp(testUtils.loadBuffer('formats/bmp/5x5.bmp'));

  expect(result).toStrictEqual(mask);
});

test('encode 6x4 mask', () => {
  const mask = testUtils.createGreyImage([
    [255, 255, 255, 255, 255, 255],
    [0, 0, 0, 0, 0, 0],
    [255, 255, 255, 255, 255, 255],
    [0, 0, 0, 0, 0, 0],
  ]);

  const result = decodeBmp(testUtils.loadBuffer('formats/bmp/6x4.bmp'));

  expect(result).toStrictEqual(mask);
});

test('decode 10x2 mask', () => {
  const mask = testUtils.createGreyImage([
    [255, 255, 255, 0, 0, 255, 0, 255, 0, 255],
    [255, 0, 255, 0, 255, 0, 0, 255, 255, 255],
  ]);

  const result = decodeBmp(testUtils.loadBuffer('formats/bmp/10x2.bmp'));

  expect(result).toStrictEqual(mask);
});
