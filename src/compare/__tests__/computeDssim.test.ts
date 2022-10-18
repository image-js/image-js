import { computeDssim } from '..';
import { Image, ImageColorModel } from '../..';

test('twice the same image', async () => {
  const image = testUtils.createGreyImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = image;
  expect(computeDssim(image, other)).toBe(0);
});

test('should be symetrical', async () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4, 5]]);
  const other = testUtils.createGreyImage([[0, 0, 0, 0, 0]]);
  expect(computeDssim(image, other)).toBe(computeDssim(other, image));
});

test('dssim should be 0.5', async () => {
  const image = new Image(11, 11, { colorModel: ImageColorModel.GREY });
  const other = Image.createFrom(image).fill(255);

  expect(image === other).toBe(false);
  expect(computeDssim(image, other)).toBeCloseTo(0.5);
});

test('dssim should be 1 (anti-correlated images)', async () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0],
    [255, 255, 255],
  ]);
  const other = testUtils.createGreyImage([
    [255, 255, 255],
    [0, 0, 0],
  ]);
  expect(image === other).toBe(false);
  expect(computeDssim(image, other)).toBeCloseTo(1);
});

test('original with itself', async () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = original;
  expect(computeDssim(original, other)).toBe(0);
});
