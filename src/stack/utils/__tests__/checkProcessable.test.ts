import { Image } from '../../../Image.js';
import { Stack } from '../../../Stack.js';
import { checkProcessable } from '../checkProcessable.js';

test('should throw if images have different sizes', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const image2 = testUtils.createGreyImage([[4, 3]]);
  const stack = new Stack([image1, image2]);
  expect(() => {
    checkProcessable(stack, { sameDimensions: true });
  }).toThrow('images must all have same dimensions to apply this algorithm');
});

test('default options', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const image2 = testUtils.createGreyImage([[4, 3, 2, 1]]);
  const stack = new Stack([image1, image2]);
  expect(() => {
    checkProcessable(stack);
  }).not.toThrow();
});

test('should have alpha channel', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const image2 = testUtils.createGreyImage([[4, 3, 2, 1]]);
  const stack = new Stack([image1, image2]);
  expect(() => {
    checkProcessable(stack, { alpha: true });
  }).toThrow(
    'stack images should have an alpha channel to apply this algorithm',
  );
});

test('should not have alpha channel', () => {
  const image1 = testUtils.createGreyaImage([[1, 2, 3, 4]]);
  const image2 = testUtils.createGreyaImage([[4, 3, 2, 1]]);
  const stack = new Stack([image1, image2]);
  expect(() => {
    checkProcessable(stack, { alpha: false });
  }).toThrow(
    'stack images should not have an alpha channel to apply this algorithm',
  );
});

test('bit depth error', () => {
  const image = new Image(1, 2, { bitDepth: 16 });
  const stack = new Stack([image, image]);
  expect(() => {
    checkProcessable(stack, { bitDepth: 8 });
  }).toThrow('image bitDepth must be 8 to apply this algorithm');
});
