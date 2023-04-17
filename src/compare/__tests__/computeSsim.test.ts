import { computeMse } from '..';
import { Image } from '../..';
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
  const image = new Image(11, 11, { colorModel: 'GREY' });
  const other = Image.createFrom(image).fill(255);

  expect(image === other).toBe(false);
  expect(computeSsim(image, other).mssim).toBeCloseTo(0, 3);
});

test('ssim should be -1 (anti-correlated images)', async () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0],
    [255, 255, 255],
  ]);
  const other = testUtils.createGreyImage([
    [255, 255, 255],
    [0, 0, 0],
  ]);
  expect(image === other).toBe(false);
  expect(computeSsim(image, other).mssim).toBeCloseTo(-1, 2);
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

test('compressed, algorithm = fast', async () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = testUtils.load('ssim/ssim-compressed.png');
  expect(computeSsim(original, other, { algorithm: 'fast' }).mssim).toBeCloseTo(
    0.7178,
    1,
  );
});

test('compressed, algorithm = bezkrovny', async () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = testUtils.load('ssim/ssim-compressed.png');
  expect(
    computeSsim(original, other, { algorithm: 'bezkrovny' }).mssim,
  ).toBeCloseTo(0.7178, 1);
});

test('compressed, algorithm = weber', async () => {
  const original = testUtils.load('ssim/ssim-original.png');
  const other = testUtils.load('ssim/ssim-compressed.png');
  expect(
    computeSsim(original, other, { algorithm: 'weber' }).mssim,
  ).toBeCloseTo(0.7178, 1);
});

test('should handle RGB images', async () => {
  const original = testUtils.load('opencv/test.png');
  const other = testUtils.load('opencv/testGaussianBlur.png');
  expect(computeSsim(original, other).mssim).toBeCloseTo(0.594, 2);
});

test('should handle RGBA images', async () => {
  const original = testUtils.load('opencv/test.png').convertColor('RGBA');
  const other = testUtils
    .load('opencv/testGaussianBlur.png')
    .convertColor('RGBA');
  expect(computeSsim(original, other).mssim).toBeCloseTo(0.594, 2);
});

test('windowSize too large error', async () => {
  const image = testUtils.createGreyImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = image;
  expect(() => {
    computeSsim(image, other, { windowSize: 5 });
  }).toThrow('windowSize cannot exceed image dimensions');
  expect(() => {
    computeSsim(image, other, { windowSize: 20 });
  }).toThrow('windowSize cannot exceed image dimensions');
});
