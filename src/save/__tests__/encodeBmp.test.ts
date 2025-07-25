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

test('should throw error', () => {
  const image = testUtils.createGreyImage([
    [255, 255, 255, 0, 0, 255, 0, 255, 0, 255],
    [255, 0, 255, 0, 255, 0, 0, 255, 255, 255],
  ]);

  expect(() => encodeBmp(image)).toThrow(
    'Image bmp encoding is not implemented.',
  );
});
