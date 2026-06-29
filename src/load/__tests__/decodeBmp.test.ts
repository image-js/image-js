import { expect, test } from 'vitest';

import { decodeBmp } from '../decodeBmp.js';

test('should decode RGBA image', () => {
  const result = decodeBmp(testUtils.loadBuffer('formats/bmp/2x2RGBA.bmp'));

  expect(result.channels).toBe(4);
  expect(result.components).toBe(3);
  expect(result).toMatchImageData([
    [255, 0, 0, 255, 0, 255, 0, 255],
    [0, 0, 255, 255, 255, 255, 255, 255],
  ]);
});

test('should decode grey image', () => {
  const result = decodeBmp(testUtils.loadBuffer('formats/bmp/gray5x5.bmp'));

  expect(result.channels).toBe(1);
  expect(result.components).toBe(1);

  expect(result).toMatchImageData([
    [246, 246, 173, 0, 0],
    [255, 255, 182, 113, 113],
    [214, 214, 206, 246, 246],
    [0, 0, 173, 255, 255],
    [0, 0, 157, 214, 214],
  ]);
});

test('should decode image resolution', () => {
  const rgba = decodeBmp(testUtils.loadBuffer('formats/bmp/2x2RGBA.bmp'));

  expect(rgba.originalResolution).toStrictEqual({
    x: 2835,
    y: 2835,
    unit: 'meter',
  });
  expect(rgba.normalizedResolution).toStrictEqual({
    x: 28.35,
    y: 28.35,
  });

  const grey = decodeBmp(testUtils.loadBuffer('formats/bmp/gray5x5.bmp'));

  expect(grey.originalResolution).toStrictEqual({
    x: 11811,
    y: 11811,
    unit: 'meter',
  });
  expect(grey.normalizedResolution).toStrictEqual({
    x: 118.11,
    y: 118.11,
  });
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

  expect(result).toMatchImage(mask);
});

test('encode 6x4 mask', () => {
  const mask = testUtils.createGreyImage([
    [255, 255, 255, 255, 255, 255],
    [0, 0, 0, 0, 0, 0],
    [255, 255, 255, 255, 255, 255],
    [0, 0, 0, 0, 0, 0],
  ]);

  const result = decodeBmp(testUtils.loadBuffer('formats/bmp/6x4.bmp'));

  expect(result).toMatchImage(mask);
});

test('decode 10x2 mask', () => {
  const mask = testUtils.createGreyImage([
    [255, 255, 255, 0, 0, 255, 0, 255, 0, 255],
    [255, 0, 255, 0, 255, 0, 0, 255, 255, 255],
  ]);

  const result = decodeBmp(testUtils.loadBuffer('formats/bmp/10x2.bmp'));

  expect(result).toMatchImage(mask);
});
