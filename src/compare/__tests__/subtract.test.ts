test('subtract image to itself', async () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = image;
  expect(image.substract(other)).toMatchImageData([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
});

test('absolute = false', async () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = testUtils.createRgbImage([[0, 0, 0, 20, 20, 20, 15, 15, 15]]);
  expect(image.substract(other, { absolute: false })).toMatchImageData([
    [5, 5, 5, 0, 0, 0, 0, 0, 0],
  ]);
});

test('absolute = true', async () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = testUtils.createRgbImage([[0, 0, 0, 20, 20, 20, 15, 15, 15]]);
  expect(image.substract(other, { absolute: true })).toMatchImageData([
    [5, 5, 5, 10, 10, 10, 0, 0, 0],
  ]);
});

test('subtract mask to itself', async () => {
  const image = testUtils.createMask([[1, 1, 0, 0]]);
  const other = image;
  expect(image.subtract(other)).toMatchMaskData([[0, 0, 0, 0]]);
});

test('absolute = false with masks', async () => {
  const image = testUtils.createMask([[1, 1, 0, 0]]);
  const other = testUtils.createMask([[1, 1, 1, 1]]);
  expect(image.subtract(other)).toMatchMaskData([[0, 0, 0, 0]]);
});

test('absolute = true with masks', async () => {
  const image = testUtils.createMask([[1, 1, 0, 0]]);
  const other = testUtils.createMask([[1, 1, 1, 1]]);
  expect(image.subtract(other, { absolute: true })).toMatchMaskData([
    [0, 0, 1, 1],
  ]);
});

test('difference size images should throw', async () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10]]);
  expect(() => {
    image.substract(other);
  }).toThrow(`subtract: both images must have the same size`);
});

test('different alpha should throw', async () => {
  const image = testUtils.createRgbaImage([
    [5, 5, 5, 0, 10, 10, 10, 0, 15, 15, 15, 0],
  ]);
  const other = testUtils.createRgbImage([[1, 1, 1, 5, 5, 5, 10, 10, 10]]);
  expect(() => {
    image.substract(other);
  }).toThrow(`subtract: both images must have the same alpha and depth`);
});

test('different number of channels should throw', async () => {
  const image = testUtils.createGreyImage([[5, 10, 15]]);
  const other = testUtils.createRgbImage([[1, 1, 1, 5, 5, 5, 10, 10, 10]]);
  expect(() => {
    image.substract(other);
  }).toThrow(`subtract: both images must have the same number of channels`);
});
