import { correctColor } from '../correctColor.js';
import { getMeasuredColors, getReferenceColors } from '../utils/formatData.js';
import { getImageColors } from '../utils/getImageColors.js';

import { polish } from './testUtils/imageColors.js';
import { referenceColorCard } from '../utils/referenceColorCard.ts';

test('RGB image should not change', () => {
  const image = testUtils.createRgbImage([[0, 0, 0, 10, 10, 10, 20, 20, 20]]);

  const measuredColors = [
    { r: 0, g: 0, b: 0 },
    { r: 50, g: 50, b: 50 },
    { r: 100, g: 100, b: 100 },
    { r: 150, g: 150, b: 150 },
    { r: 200, g: 200, b: 200 },
  ];

  const result = image.correctColor(measuredColors, measuredColors);

  expect(result).toMatchImage(image, { error: 1 });
});

test('RGBA image should not change', () => {
  const image = testUtils.createRgbaImage([
    [0, 0, 0, 0, 10, 10, 10, 100, 20, 20, 20, 200],
  ]);

  const measuredColors = [
    { r: 0, g: 0, b: 0 },
    { r: 50, g: 50, b: 50 },
    { r: 100, g: 100, b: 100 },
    { r: 150, g: 150, b: 150 },
    { r: 200, g: 200, b: 200 },
  ];

  const result = correctColor(image, measuredColors, measuredColors);

  expect(result).toMatchImage(image, { error: 1 });
});

test('RGB image, measured colors are translated', () => {
  const image = testUtils.createRgbImage([
    [10, 10, 10, 100, 100, 100, 150, 150, 150],
  ]);

  const measuredColors = [
    { r: 5, g: 5, b: 5 },
    { r: 55, g: 55, b: 55 },
    { r: 105, g: 105, b: 105 },
    { r: 155, g: 155, b: 155 },
    { r: 205, g: 205, b: 205 },
  ];

  const referenceColors = [
    { r: 0, g: 0, b: 0 },
    { r: 50, g: 50, b: 50 },
    { r: 100, g: 100, b: 100 },
    { r: 150, g: 150, b: 150 },
    { r: 200, g: 200, b: 200 },
  ];

  const result = correctColor(image, measuredColors, referenceColors);

  expect(result).toMatchImageData([[5, 5, 5, 95, 95, 95, 145, 145, 145]], {
    error: 1,
  });
});

test('small RGB image with true reference and measured colors', () => {
  const image = testUtils.load('correctColor/test.png');

  const measuredColors = getMeasuredColors(polish);
  const referenceColors = getReferenceColors(referenceColorCard);

  const result = correctColor(image, measuredColors, referenceColors);

  expect(result).toMatchImageSnapshot();
});

test('modified color balance', () => {
  const image = testUtils.load('correctColor/color-balance.png');
  const reference = testUtils.load('correctColor/test.png');

  const measuredColors = getImageColors(image);
  const referenceColors = getImageColors(reference);

  const result = correctColor(image, measuredColors, referenceColors);

  expect(result).toMatchImage(reference, { error: 1 });
});

test('exposure -1', () => {
  let image = testUtils.load('correctColor/exposure-minus-1.png');
  let reference = testUtils.load('correctColor/test.png');

  image = image.crop({ origin: { row: 2, column: 1 }, width: 6, height: 6 });
  reference = reference.crop({
    origin: { row: 2, column: 1 },
    width: 6,
    height: 6,
  });

  const measuredColors = getImageColors(image);
  const referenceColors = getImageColors(reference);

  const result = correctColor(image, measuredColors, referenceColors);

  expect(result).toMatchImage(reference, { error: 1 });
});

test('exposure +1', () => {
  let image = testUtils.load('correctColor/exposure-plus-1.png');
  let reference = testUtils.load('correctColor/test.png');

  image = image.crop({ origin: { row: 2, column: 1 }, width: 6, height: 6 });
  reference = reference.crop({
    origin: { row: 2, column: 1 },
    width: 6,
    height: 6,
  });

  const measuredColors = getImageColors(image);
  const referenceColors = getImageColors(reference);

  const result = correctColor(image, measuredColors, referenceColors);

  expect(result).toMatchImage(reference, { error: 1 });
});

test('inverted', () => {
  let image = testUtils.load('correctColor/inverted.png');
  let reference = testUtils.load('correctColor/test.png');

  image = image.crop({ origin: { row: 2, column: 1 }, width: 6, height: 6 });
  reference = reference.crop({
    origin: { row: 2, column: 1 },
    width: 6,
    height: 6,
  });

  const measuredColors = getImageColors(image);
  const referenceColors = getImageColors(reference);

  const result = correctColor(image, measuredColors, referenceColors);

  expect(result).toMatchImage(reference, { error: 1 });
});

test('offsets', () => {
  let image = testUtils.load('correctColor/offsets.png');
  let reference = testUtils.load('correctColor/test.png');

  image = image.crop({ origin: { row: 2, column: 1 }, width: 6, height: 6 });
  reference = reference.crop({
    origin: { row: 2, column: 1 },
    width: 6,
    height: 6,
  });

  const measuredColors = getImageColors(image);
  const referenceColors = getImageColors(reference);

  const result = correctColor(image, measuredColors, referenceColors);

  // All colors are nearly perfectly corrected, except the gray.
  expect(result).toMatchImageSnapshot();
});

test('inverted, black and white pixel', () => {
  const image = testUtils.createRgbImage([[0, 0, 0, 255, 255, 255]]);
  const reference = testUtils.createRgbImage([[255, 255, 255, 0, 0, 0]]);

  const measuredColors = getImageColors(image);
  const referenceColors = getImageColors(reference);

  const result = correctColor(image, measuredColors, referenceColors);

  expect(result).toMatchImage(reference, { error: 1 });
});

test('should throw on different array length', () => {
  const image = testUtils.createRgbImage([
    [10, 10, 10, 100, 100, 100, 150, 150, 150],
  ]);

  const measuredColors = [
    { r: 5, g: 5, b: 5 },
    { r: 55, g: 55, b: 55 },
    { r: 105, g: 105, b: 105 },
  ];

  const referenceColors = [
    { r: 0, g: 0, b: 0 },
    { r: 50, g: 50, b: 50 },
    { r: 100, g: 100, b: 100 },
    { r: 150, g: 150, b: 150 },
    { r: 200, g: 200, b: 200 },
  ];

  expect(() => {
    image.correctColor(measuredColors, referenceColors);
  }).toThrow('number of measured colors and reference colors must be the same');
});
