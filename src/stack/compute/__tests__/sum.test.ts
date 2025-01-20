import { join } from 'node:path';

import { Image } from '../../../Image.js';
import { Stack } from '../../../Stack.js';
import { getStackFromFolder } from '../../utils/getStackFromFolder.js';

test('2 grey images', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const image2 = testUtils.createGreyImage([[4, 3, 2, 1]]);
  const stack = new Stack([image1, image2]);
  const sum = stack.sum();

  expect(sum).toBeInstanceOf(Image);
  expect(sum.bitDepth).toBe(16);
  expect(sum).toMatchImageData([[5, 5, 5, 5]]);
});

test('2 RGB images', () => {
  const image1 = testUtils.createRgbImage([[1, 2, 3]]);
  const image2 = testUtils.createRgbImage([[5, 6, 7]]);
  const stack = new Stack([image1, image2]);
  const sum = stack.sum();

  expect(sum).toMatchImageData([[6, 8, 10]]);
});

test('more complex stack', () => {
  const folder = join(__dirname, '../../../../test/img/correctColor');
  const stack = getStackFromFolder(folder);
  expect(stack.sum()).toMatchImageSnapshot();
});

test('should throw if 16 bits depth', () => {
  const data = new Uint16Array([1, 2, 3, 4]);
  const image1 = new Image(4, 1, { data, bitDepth: 16, colorModel: 'GREY' });
  const image2 = new Image(4, 1, { data, bitDepth: 16, colorModel: 'GREY' });
  const stack = new Stack([image1, image2]);

  expect(() => {
    return stack.sum();
  }).toThrow('image bitDepth must be 8 to apply this algorithm');
});

test('should throw if too many images in stack', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const images = new Array(500).fill(image1);
  const stack = new Stack(images);

  expect(() => {
    return stack.sum();
  }).toThrow('Maximal valid stack size is 257');
});
