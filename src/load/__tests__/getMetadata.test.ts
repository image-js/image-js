import { expect, test } from 'vitest';

import { decodeJpeg } from '../decodeJpeg.js';
import { decodeTiff } from '../decodeTiff.js';

test('without metadata', () => {
  const buffer = testUtils.loadBuffer(`various/without-metadata.jpg`);
  const img = decodeJpeg(buffer);

  expect(img.meta).toBeUndefined();
});

test('with metadata', () => {
  const buffer = testUtils.loadBuffer(`formats/grey6.jpg`);
  const img = decodeJpeg(buffer);

  expect(img.meta).toBeDefined();
  expect(img.meta?.resolution).toStrictEqual({
    x: 1.828799999998025,
    y: 1.828799999998025,
    unit: 'meter',
    originalValues: {
      unit: 'inch',
      x: 72,
      y: 72,
    },
  });

  const img2 = testUtils.load(`formats/tif/dog.tif`);

  expect(img2.meta?.resolution).toBeUndefined();
});

test('with metadata 2', () => {
  expect(() => {
    const buffer = testUtils.loadBuffer(`formats/tif/grey32.tif`);
    decodeTiff(buffer);
  }).toThrow('Float TIFF data is not supported.');
});
