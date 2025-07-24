import { expect, test } from 'vitest';

import flipX from '../flipX.js';

test('should flip pixels horizontally of all RGBA components for a [2,1] image', () => {
  const image = testUtils.createRgbaImage([[1, 2, 3, 4, 5, 6, 7, 8]]);
  const expected = flipX(image);

  expect(expected).toMatchImageData([[5, 6, 7, 8, 1, 2, 3, 4]]);
});

test('should flip pixels horizontally of all RGBA components for a [2,2] image', () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15, 16],
  ]);

  const expected = flipX(image);

  expect(expected).toMatchImageData([
    [5, 6, 7, 8, 1, 2, 3, 4],
    [13, 14, 15, 16, 9, 10, 11, 12],
  ]);
});

test('should flip pixels horizontally of all RGBA components for a [3,2] image', () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  ]);

  const expected = flipX(image);

  expect(expected).toMatchImageData([
    [9, 10, 11, 12, 5, 6, 7, 8, 1, 2, 3, 4],
    [21, 22, 23, 24, 17, 18, 19, 20, 13, 14, 15, 16],
  ]);
});

test('should flip pixels horizontally of GREY image', () => {
  const image = testUtils.createGreyImage([
    [1, 2],
    [3, 4],
  ]);

  const expected = flipX(image);

  expect(expected).toMatchImageData([
    [2, 1],
    [4, 3],
  ]);
});
