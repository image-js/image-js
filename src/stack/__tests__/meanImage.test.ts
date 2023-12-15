import { join } from 'node:path';

import { Image } from '../../Image';
import { Stack } from '../../Stack';
import { getStackFromFolder } from '../utils/getStackFromFolder';

test('2 grey images', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const image2 = testUtils.createGreyImage([[4, 3, 2, 1]]);
  const stack = new Stack([image1, image2]);
  const meanImage = stack.meanImage();

  expect(meanImage).toBeInstanceOf(Image);
  expect(meanImage.width).toBe(4);
  expect(meanImage.height).toBe(1);
  expect(meanImage.channels).toBe(1);
  expect(meanImage).toMatchImageData([[2, 2, 2, 2]]);
});

test('2 RGB images', () => {
  const image1 = testUtils.createRgbImage([[1, 2, 3]]);
  const image2 = testUtils.createRgbImage([[5, 6, 7]]);
  const stack = new Stack([image1, image2]);
  const meanImage = stack.meanImage();

  expect(meanImage).toBeInstanceOf(Image);
  expect(meanImage.width).toBe(1);
  expect(meanImage.height).toBe(1);
  expect(meanImage.channels).toBe(3);
  expect(meanImage).toMatchImageData([[3, 4, 5]]);
});

test('more complex stack', () => {
  const folder = join(__dirname, '../../../test/img/correctColor');
  const stack = getStackFromFolder(folder);
  expect(stack.meanImage()).toMatchImageSnapshot();
});

test('2 grey images 16 bits depth', () => {
  const data = new Uint16Array([1, 2, 3, 4]);
  const image1 = new Image(4, 1, { data, bitDepth: 16, colorModel: 'GREY' });
  const image2 = new Image(4, 1, { data, bitDepth: 16, colorModel: 'GREY' });
  const stack = new Stack([image1, image2]);
  const meanImage = stack.meanImage();

  expect(meanImage).toBeInstanceOf(Image);
  expect(meanImage.bitDepth).toBe(16);
  expect(meanImage).toMatchImage(image1);
});
