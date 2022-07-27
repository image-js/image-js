import { getMinMax } from '../getMinMax';

test('grey image', () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4, 5, 7, 4, 9, 6]]);
  expect(getMinMax(image)).toStrictEqual({ min: [1], max: [9] });
});

test('greya image', () => {
  const image = testUtils.createGreyaImage([
    [1, 2],
    [3, 4],
    [5, 7],
    [4, 9],
  ]);
  expect(getMinMax(image)).toStrictEqual({ min: [1, 2], max: [5, 9] });
});

test('rgb image', () => {
  const image = testUtils.createRgbImage([
    [1, 2, 3],
    [4, 5, 7],
    [4, 9, 2],
  ]);
  expect(getMinMax(image)).toStrictEqual({ min: [1, 2, 2], max: [4, 9, 7] });
});

test('rgba image', () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 3, 0],
    [4, 5, 7, 5],
    [4, 9, 2, 7],
  ]);
  expect(getMinMax(image)).toStrictEqual({
    min: [1, 2, 2, 0],
    max: [4, 9, 7, 7],
  });
});
