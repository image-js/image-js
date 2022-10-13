import { computeMse } from '..';
import { Image, ImageColorModel } from '../..';
import { computeSsim } from '../computeSsim';

test('twice the same image', async () => {
  const image = testUtils.createGreyImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = image;
  expect(computeSsim(image, other).mssim).toBe(1);
});

test('should be symetrical', async () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4, 5]]);
  const other = testUtils.createGreyImage([[0, 0, 0, 0, 0]]);
  expect(computeSsim(image, other).mssim).toBe(computeSsim(other, image).mssim);
});

test('ssim should be zero', async () => {
  const image = new Image(11, 11, { colorModel: ImageColorModel.GREY });
  const other = Image.createFrom(image).fill(255);

  expect(image === other).toBe(false);
  expect(computeSsim(image, other).mssim).toBeCloseTo(0, 3);
});

test('original with itself', async () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = original;
  expect(computeSsim(original, other).mssim).toBe(1);
  expect(computeMse(original, other)).toBe(0);
});

// In the following tests the SSIM expected values were computed with Matlab.

test('more contrast', async () => {
  let original = testUtils.load('ssim/ssim-original.png');
  let other = testUtils.load('ssim/ssim-contrast.png');
  expect(computeSsim(original, other).mssim).toBeCloseTo(0.8201, 1);
});

test('salt and pepper noise', async () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = testUtils.load('ssim/ssim-saltPepper.png');
  expect(computeSsim(original, other).mssim).toBeCloseTo(0.7831);
});

test('blurry', async () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = testUtils.load('ssim/ssim-blurry.png');
  expect(computeSsim(original, other).mssim).toBeCloseTo(0.7659, 1);
});

test('compressed', async () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = testUtils.load('ssim/ssim-compressed.png');
  expect(computeSsim(original, other).mssim).toBeCloseTo(0.7178, 1);
});
