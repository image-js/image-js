import { Image, ImageColorModel } from '../..';

test('twice the same image', async () => {
  const image = testUtils.createGreyImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = image;
  expect(image.ssim(other)).toBe(1);
});

test('should be symetrical', async () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4, 5]]);
  const other = testUtils.createGreyImage([[0, 0, 0, 0, 0]]);
  expect(image.ssim(other)).toBe(other.ssim(image));
});

test.only('ssim should be zero', async () => {
  const image = new Image(11, 11, { colorModel: ImageColorModel.GREY });
  const other = Image.createFrom(image).fill(3);

  expect(image === other).toBe(false);
  expect(image.ssim(other)).toBe(0);
});

test('original with itself', async () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = original;
  expect(original.ssim(other)).toBe(1);
  expect(original.mse(other)).toBe(0);
});

test('salt and pepper noise', async () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = testUtils.load('ssim/ssim-0.840.png');
  expect(original.mse(other)).toBeCloseTo(160.6, 1);
  expect(original.ssim(other)).toBe(0.84);
});

test('corrupted image', async () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = testUtils.load('ssim/ssim-0.662.png');

  expect(original.ssim(other)).toBe(0.662);
});
