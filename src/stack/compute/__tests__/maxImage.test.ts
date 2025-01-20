import { join } from 'node:path';

import { Image } from '../../../Image.js';
import { Stack } from '../../../Stack.js';
import { getStackFromFolder } from '../../utils/getStackFromFolder.js';

test('2 grey images', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const image2 = testUtils.createGreyImage([[4, 3, 2, 1]]);
  const stack = new Stack([image1, image2]);
  const maxImage = stack.maxImage();

  expect(maxImage).toBeInstanceOf(Image);
  expect(maxImage.width).toBe(4);
  expect(maxImage.height).toBe(1);
  expect(maxImage.channels).toBe(1);
  expect(maxImage).toMatchImageData([[4, 3, 3, 4]]);
});

test('more complex stack', () => {
  const folder = join(__dirname, '../../../../test/img/correctColor');
  const stack = getStackFromFolder(folder);

  expect(stack.maxImage()).toMatchImageSnapshot();
});

test('2 RGB images', () => {
  const image1 = testUtils.createRgbImage([[1, 2, 10]]);
  const image2 = testUtils.createRgbImage([[5, 6, 7]]);
  const stack = new Stack([image1, image2]);
  const maxImage = stack.maxImage();

  expect(maxImage).toBeInstanceOf(Image);
  expect(maxImage.width).toBe(1);
  expect(maxImage.height).toBe(1);
  expect(maxImage.channels).toBe(3);
  expect(maxImage).toMatchImageData([[5, 6, 10]]);
});
