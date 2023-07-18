import { computeMse, computeRmse } from '../computeRmse';

test('twice the same image', () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = image;
  expect(computeRmse(image, other)).toBe(0);
});

test('images are full of zeros', () => {
  const image = testUtils.createRgbImage([[0, 0, 0, 0, 0, 0]]);
  const other = image;
  expect(computeRmse(image, other)).toBe(0);
});
test('should be symetrical', () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4, 5]]);
  const other = testUtils.createGreyImage([[0, 0, 0, 0, 0]]);
  expect(computeMse(image, other)).toBe(11);
  expect(computeMse(other, image)).toBe(11);
});
test('RGBA images', () => {
  const image = testUtils.createRgbaImage([[50, 100, 150, 200]]);
  const other = testUtils.createRgbaImage([[0, 50, 100, 150]]);
  expect(computeMse(image, other)).toBe(2500);
  expect(computeRmse(image, other)).toBe(50);
});
