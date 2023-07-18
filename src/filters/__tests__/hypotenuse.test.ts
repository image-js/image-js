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
