import { join } from 'node:path';

import { Image } from '../../../Image';
import { Stack } from '../../../Stack';
import { getStackFromFolder } from '../../utils/getStackFromFolder';

test('3 grey images', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const image2 = testUtils.createGreyImage([[4, 3, 2, 1]]);
  const image3 = testUtils.createGreyImage([[4, 3, 2, 1]]);
  const stack = new Stack([image1, image2, image3]);
  const meanImage = stack.medianImage();

  expect(meanImage).toBeInstanceOf(Image);
  expect(meanImage.width).toBe(4);
  expect(meanImage.height).toBe(1);
  expect(meanImage.channels).toBe(1);
  expect(meanImage).toMatchImageData([[4, 3, 2, 1]]);
});

test('3 RGB images', () => {
  const image1 = testUtils.createRgbImage([[1, 2, 3]]);
  const image2 = testUtils.createRgbImage([[5, 6, 7]]);
  const image3 = testUtils.createRgbImage([[1, 5, 18]]);
  const stack = new Stack([image1, image2, image3]);
  const medianImage = stack.medianImage();

  expect(medianImage).toBeInstanceOf(Image);
  expect(medianImage.width).toBe(1);
  expect(medianImage.height).toBe(1);
  expect(medianImage.channels).toBe(3);
  expect(medianImage).toMatchImageData([[1, 5, 7]]);
});

test('more complex stack', () => {
  const folder = join(__dirname, '../../../../test/img/correctColor');
  const stack = getStackFromFolder(folder);
  expect(stack.medianImage()).toMatchImageSnapshot();
});
