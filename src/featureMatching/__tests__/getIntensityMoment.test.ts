import { ImageColorModel, Image } from '../../Image';
import { getIntensityMoment } from '../getIntensityMoment';

test('3x3 empty image, 00', () => {
  const image = new Image(3, 3, { colorModel: ImageColorModel.GREY });
  const result = getIntensityMoment(image, 0, 0);
  expect(result).toStrictEqual([0]);
});

test('1D image, 00', () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4, 5]]);
  const result = getIntensityMoment(image, 0, 0);
  // should be the sum of all elements
  expect(result).toStrictEqual([15]);
});

test('1D image, 10', () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4, 5]]);
  const result = getIntensityMoment(image, 1, 0);
  expect(result).toStrictEqual([10]);
});

test('3x3 image, 01', () => {
  const image = testUtils.createGreyImage([
    [1, 0, 3],
    [2, 0, 2],
    [3, 0, 1],
  ]);
  const result = getIntensityMoment(image, 0, 1);
  expect(result).toStrictEqual([0]);
});

test('RGB image, 01', () => {
  const image = testUtils.createRgbImage([
    [1, 0, 3],
    [2, 0, 2],
    [3, 0, 1],
  ]);
  const result = getIntensityMoment(image, 0, 1);
  expect(result).toStrictEqual([2, 0, -2]);
});

test('4x4 image, 01', () => {
  const image = testUtils.createGreyImage([
    [1, 0, 4, 5],
    [2, 0, 3, 5],
    [3, 0, 2, 5],
    [4, 0, 1, 5],
  ]);
  const result = getIntensityMoment(image, 0, 1);
  expect(result).toStrictEqual([0]);
});

test('2x2 image, 01', () => {
  const image = testUtils.createGreyImage([
    [1, 0],
    [2, 0],
  ]);
  const result = getIntensityMoment(image, 0, 1);
  expect(result).toStrictEqual([0.5]);
});
