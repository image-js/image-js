import { computePsnr } from '../computePsnr.js';

test('twice the same image', () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = image;
  expect(computePsnr(image, other)).toBe(Number.POSITIVE_INFINITY);
});

test('images are full of zeros', () => {
  const image = testUtils.createRgbImage([[0, 0, 0, 0, 0, 0]]);
  const other = image;
  expect(computePsnr(image, other)).toBe(Number.POSITIVE_INFINITY);
});
test('should be symetrical', () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4, 5]]);
  const other = testUtils.createGreyImage([[0, 0, 0, 0, 0]]);
  expect(computePsnr(image, other)).toBeCloseTo(37.717);
  expect(computePsnr(other, image)).toBeCloseTo(37.717);
});
test('RGBA images', () => {
  const image = testUtils.createRgbaImage([[50, 100, 150, 200]]);
  const other = testUtils.createRgbaImage([[0, 50, 100, 150]]);
  expect(computePsnr(image, other)).toBe(20 * Math.log10(255 / 50));
});
