import { expect, test } from 'vitest';

import { Image } from '../../Image.js';
import { computeDssim } from '../compute_dssim.js';

test('twice the same image', () => {
  const image = testUtils.createGreyImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = image;

  expect(computeDssim(image, other)).toBe(0);
});

test('should be symetrical', () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4, 5]]);
  const other = testUtils.createGreyImage([[0, 0, 0, 0, 0]]);

  expect(computeDssim(image, other)).toBe(computeDssim(other, image));
});

test('dssim should be 0.5', () => {
  const image = new Image(11, 11, { colorModel: 'GREY' });
  const other = Image.createFrom(image).fill(255);

  expect(image).not.toBe(other);
  expect(computeDssim(image, other)).toBeCloseTo(0.5);
});

test('dssim should be 1 (anti-correlated images)', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0],
    [255, 255, 255],
  ]);
  const other = testUtils.createGreyImage([
    [255, 255, 255],
    [0, 0, 0],
  ]);

  expect(image).not.toBe(other);
  expect(computeDssim(image, other)).toBeCloseTo(1);
});

test('original with itself', () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = original;

  expect(computeDssim(original, other)).toBe(0);
});
