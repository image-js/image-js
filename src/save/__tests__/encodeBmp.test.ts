import { expect, test } from 'vitest';

import { encodeBmp } from '../encodeBmp.js';

test('encode 5x5 mask', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 0, 255, 0],
    [0, 255, 255, 255, 0],
    [255, 0, 255, 0, 255],
  ]);
  const mask = image.threshold({ threshold: 0.5 });
  const result = testUtils.loadBuffer('formats/bmp/5x5.bmp');
  const buffer = encodeBmp(mask);

  expect(buffer).toStrictEqual(result);
});

test('encode 6x4 mask', () => {
  const image = testUtils.createGreyImage([
    [255, 255, 255, 255, 255, 255],
    [0, 0, 0, 0, 0, 0],
    [255, 255, 255, 255, 255, 255],
    [0, 0, 0, 0, 0, 0],
  ]);
  const mask = image.threshold({ threshold: 0.5 });
  const result = testUtils.loadBuffer('formats/bmp/6x4.bmp');
  const buffer = encodeBmp(mask);

  expect(buffer).toStrictEqual(result);
});

test('encode 10x2 mask', () => {
  const image = testUtils.createGreyImage([
    [255, 255, 255, 0, 0, 255, 0, 255, 0, 255],
    [255, 0, 255, 0, 255, 0, 0, 255, 255, 255],
  ]);
  const mask = image.threshold({ threshold: 0.5 });
  const result = testUtils.loadBuffer('formats/bmp/10x2.bmp');
  const buffer = encodeBmp(mask);

  expect(buffer).toStrictEqual(result);
});

test('should encode grayscale image', () => {
  const result = encodeBmp(testUtils.load('formats/bmp/6x4Grey.bmp'));
  const data = testUtils.loadBuffer('formats/bmp/6x4Grey.bmp');

  expect(result).toStrictEqual(data);
});

test('should encode RGB image', () => {
  const data = testUtils.loadBuffer('formats/bmp/blackbuck.bmp');
  const result = encodeBmp(testUtils.load('formats/bmp/blackbuck.bmp'));

  expect(result).toStrictEqual(data);
});

test('should encode RGBA image', () => {
  const data = testUtils.loadBuffer('formats/bmp/bmp_24.bmp');
  const result = encodeBmp(testUtils.load('formats/bmp/bmp_24.bmp'));

  expect(result).toStrictEqual(data);
});
