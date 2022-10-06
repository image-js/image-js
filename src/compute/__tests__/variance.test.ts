import { variance } from '../variance';

test('1x1 RGB image', () => {
  const image = testUtils.createRgbImage([[1, 2, 3]]);

  expect(variance(image)).toStrictEqual(2 / 3);
});

test('GREY image', () => {
  const image = testUtils.createGreyImage([
    [10, 20, 30, 40],
    [50, 60, 70, 80],
  ]);

  const result = image.variance();

  expect(result).toBe(525);
});
