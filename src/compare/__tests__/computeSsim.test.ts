import { computeMse } from '..';
import { Image, ImageColorModel } from '../..';
import { computeSsim } from '../computeSsim';

test('twice the same image', async () => {
  const image = testUtils.createGreyImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = image;
  expect(computeSsim(image, other)).toBe(1);
});

test('should be symetrical', async () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4, 5]]);
  const other = testUtils.createGreyImage([[0, 0, 0, 0, 0]]);
  expect(computeSsim(image, other)).toBe(computeSsim(other, image));
});

test('ssim should be zero', async () => {
  const image = new Image(11, 11, { colorModel: ImageColorModel.GREY });
  const other = Image.createFrom(image).fill(255);

  expect(image === other).toBe(false);
  expect(computeSsim(image, other)).toBeCloseTo(0, 4);
});

test('original with itself', async () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = original;
  expect(computeSsim(original, other)).toBe(1);
  expect(computeMse(original, other)).toBe(0);
});

test.only('more contrast', async () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = testUtils.load('ssim/ssim-contrast.png');

  //expect(mse(original, other)).toBeCloseTo(160.6, 1);
  expect(computeSsim(original, other)).toBe(0.913);
});

test('salt and pepper noise', async () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = testUtils.load('ssim/ssim-saltPepper.png');
  //expect(mse(original, other)).toBeCloseTo(160.6, 1);
  expect(computeSsim(original, other)).toBe(0.84);
});

test('blurry', async () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = testUtils.load('ssim/ssim-blurry.png');
  // expect(mse(original, other)).toBeCloseTo(160.6, 1);
  expect(computeSsim(original, other)).toBe(0.694);
});

test('corrupted image', async () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = testUtils.load('ssim/ssim-corrupted.png');
  // expect(mse(original, other)).toBeCloseTo(160.6, 1);
  expect(computeSsim(original, other)).toBe(0.662);
});
