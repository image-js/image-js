import { Image } from 'test/common';

import {
  getOutputImage,
  getOutputImageOrInPlace
} from '../getOutputImage';

const thisImage = new Image(2, 3);

test('inPlace has wrong type', () => {
  [null, 'string', 42, [], {}].forEach((value) => {
    expect(
      () => getOutputImageOrInPlace(thisImage, { inPlace: value })
    ).toThrow(/inPlace option must be a boolean/);
  });
});

test('inPlace is true, out is set', () => {
  expect(
    () => getOutputImageOrInPlace(thisImage, { inPlace: true, out: thisImage })
  ).toThrow(/out option must not be set/);
});

test('inPlace is true', () => {
  expect(getOutputImageOrInPlace(thisImage, { inPlace: true })).toBe(thisImage);
});

test('inPlace is false', () => {
  const result = getOutputImageOrInPlace(thisImage, { inPlace: false });
  expect(Image.isImage(result)).toBe(true);
  expect(result).not.toBe(thisImage);
});

test('inPlace is undefined', () => {
  const result = getOutputImageOrInPlace(thisImage, {});
  expect(Image.isImage(result)).toBe(true);
  expect(result).not.toBe(thisImage);
});

test('getOutputImage no out', () => {
  const result = getOutputImage(thisImage, {});
  expect(Image.isImage(result)).toBe(true);
  expect(result.width).toBe(2);
});

test('getOutputImage no out with params', () => {
  const result = getOutputImage(thisImage, {}, { width: 4 });
  expect(Image.isImage(result)).toBe(true);
  expect(result.width).toBe(4);
});

test('getOutputImage wrong out', () => {
  [null, 'string', true, 42, [], {}].forEach((value) => {
    expect(
      () => getOutputImage(thisImage, { out: value })
    ).toThrow(/out must be an Image object/);
  });
});

test('getOutputImage with requirements OK - pass this', () => {
  const result = getOutputImage(thisImage, { out: thisImage }, { width: 2 });
  expect(result).toBe(thisImage);
});

test('getOutputImage with requirements OK - pass other', () => {
  const other = Image.createFrom(thisImage);
  const result = getOutputImage(thisImage, { out: other }, { width: 2 });
  expect(result).toBe(other);
});

test('getOutputImage with requirements NOK - pass this', () => {
  expect(
    () => getOutputImage(thisImage, { out: thisImage }, { width: 4 })
  ).toThrow(/cannot use out\. Its width must be "4" \(found "2"\)/);
});

test('getOutputImage with requirements NOK - pass other', () => {
  const other = Image.createFrom(thisImage);
  expect(
    () => getOutputImage(thisImage, { out: other }, { width: 4 })
  ).toThrow(/cannot use out\. Its width must be "4" \(found "2"\)/);
});
