import { add } from '../add.js';

test('add image to itself', () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = image;
  expect(add(image, other)).toMatchImageData([
    [10, 10, 10, 20, 20, 20, 30, 30, 30],
  ]);
});

test('add two different images', () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = testUtils.createRgbImage([[0, 0, 0, 20, 20, 20, 15, 15, 15]]);
  expect(add(image, other)).toMatchImageData([
    [5, 5, 5, 30, 30, 30, 30, 30, 30],
  ]);
});

test('add two different images whose sum exceeds the maxValue', () => {
  const image = testUtils.createRgbImage([
    [200, 200, 5, 10, 10, 10, 15, 15, 15],
  ]);
  const other = testUtils.createRgbImage([
    [240, 200, 20, 20, 250, 20, 15, 15, 15],
  ]);
  expect(image.add(other)).toMatchImageData([
    [255, 255, 25, 30, 255, 30, 30, 30, 30],
  ]);
});

test('different bitDepth should throw', () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]], {
    bitDepth: 16,
  });
  const other = testUtils.createRgbImage([[0, 0, 0, 20, 20, 20, 15, 15, 15]], {
    bitDepth: 8,
  });
  expect(() => {
    return add(image, other);
  }).toThrow('both images must have the same alpha and bitDepth');
});

test('different size images should throw', () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10]]);
  expect(() => {
    add(image, other);
  }).toThrow(`both images must have the same size`);
});

test('different number of channels should throw', () => {
  const image = testUtils.createGreyImage([[5, 10, 15]]);
  const other = testUtils.createRgbImage([[1, 1, 1, 5, 5, 5, 10, 10, 10]]);
  expect(() => {
    image.subtract(other);
  }).toThrow(`both images must have the same number of channels`);
});

test('different number of channels should throw', () => {
  const image = testUtils.createGreyImage([[5, 10, 15]]);
  const other = testUtils.createRgbImage([[1, 1, 1, 5, 5, 5, 10, 10, 10]]);
  expect(() => {
    image.subtract(other);
  }).toThrow(`both images must have the same number of channels`);
});
