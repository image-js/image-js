test('subtract image to itself', () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = image;
  expect(image.subtract(other)).toMatchImageData([[0, 0, 0, 0, 0, 0, 0, 0, 0]]);
});

test('absolute = false', () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = testUtils.createRgbImage([[0, 0, 0, 20, 20, 20, 15, 15, 15]]);
  expect(image.subtract(other, { absolute: false })).toMatchImageData([
    [5, 5, 5, 0, 0, 0, 0, 0, 0],
  ]);
});

test('absolute = true', () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = testUtils.createRgbImage([[0, 0, 0, 20, 20, 20, 15, 15, 15]]);
  expect(image.subtract(other, { absolute: true })).toMatchImageData([
    [5, 5, 5, 10, 10, 10, 0, 0, 0],
  ]);
});

test('subtract mask to itself', () => {
  const image = testUtils.createMask([[1, 1, 0, 0]]);
  const other = image;
  expect(image.subtract(other)).toMatchMaskData([[0, 0, 0, 0]]);
});

test('absolute = false with masks', () => {
  const image = testUtils.createMask([[1, 1, 0, 0]]);
  const other = testUtils.createMask([[0, 1, 1, 1]]);
  expect(image.subtract(other)).toMatchMaskData([[1, 0, 0, 0]]);
});

test('absolute = true with masks', () => {
  const image = testUtils.createMask([[1, 1, 0, 0]]);
  const other = testUtils.createMask([[1, 1, 1, 1]]);
  expect(image.subtract(other, { absolute: true })).toMatchMaskData([
    [0, 0, 1, 1],
  ]);
});

test('difference size images should throw', () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10]]);
  expect(() => {
    image.subtract(other);
  }).toThrow(`both images must have the same size`);
});

test('different alpha should throw', () => {
  const image = testUtils.createRgbaImage([
    [5, 5, 5, 0, 10, 10, 10, 0, 15, 15, 15, 0],
  ]);
  const other = testUtils.createRgbImage([[1, 1, 1, 5, 5, 5, 10, 10, 10]]);
  expect(() => {
    image.subtract(other);
  }).toThrow(`both images must have the same alpha and bitDepth`);
});

test('different number of channels should throw', () => {
  const image = testUtils.createGreyImage([[5, 10, 15]]);
  const other = testUtils.createRgbImage([[1, 1, 1, 5, 5, 5, 10, 10, 10]]);
  expect(() => {
    image.subtract(other);
  }).toThrow(`both images must have the same number of channels`);
});
