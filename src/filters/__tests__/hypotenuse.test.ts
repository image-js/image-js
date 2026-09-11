import { expect, test } from 'vitest';

test('testing with pythagorean triples', () => {
  const image = testUtils.createGreyImage([[3, 5, 8, 7]]);
  const otherImage = testUtils.createGreyImage([[4, 12, 15, 24]]);

  const expected = testUtils.createGreyImage([[5, 13, 17, 25]]);

  expect(image.hypotenuse(otherImage)).toMatchImage(expected);
});

test('function should be symmetrical', () => {
  const image = testUtils.load('opencv/test.png');
  const otherImage = testUtils.load('opencv/testBlur.png');

  expect(image.hypotenuse(otherImage)).toMatchImage(
    otherImage.hypotenuse(image),
  );
});

test('different size error', () => {
  const image = testUtils.createGreyImage([[3, 8, 7]]);
  const otherImage = testUtils.createGreyImage([[4, 12, 15, 24]]);

  expect(() => {
    image.hypotenuse(otherImage);
  }).toThrow('both images must have the same size');
});

test('different bit depth or alpha error', () => {
  const image = testUtils.createRgbaImage([[3, 5, 8, 7]]);
  const otherImage = testUtils.createGreyImage([[4]]);

  expect(() => {
    image.hypotenuse(otherImage);
  }).toThrow('both images must have the same alpha and bitDepth');
});

test('different number of channels', () => {
  const image = testUtils.createRgbaImage([[3, 5, 8, 7]]);
  const otherImage = testUtils.createGreyaImage([[4, 20]]);

  expect(() => {
    image.hypotenuse(otherImage);
  }).toThrow('both images must have the same number of channels');
});

test('testing with a custom channel', () => {
  const image = testUtils.createRgbImage([[3, 5, 8]]);
  const otherImage = testUtils.createRgbImage([[4, 12, 15]]);

  const expected = testUtils.createRgbImage([[3, 13, 8]]);

  expect(image.hypotenuse(otherImage, { channels: [1] })).toMatchImage(
    expected,
  );
});

test('testing with custom channels', () => {
  const image = testUtils.createRgbaImage([[3, 5, 8, 0]]);
  const otherImage = testUtils.createRgbaImage([[4, 12, 15, 0]]);

  const expected = testUtils.createRgbaImage([[5, 13, 17, 0]]);

  expect(image.hypotenuse(otherImage, { channels: [0, 1, 2] })).toMatchImage(
    expected,
  );
});
