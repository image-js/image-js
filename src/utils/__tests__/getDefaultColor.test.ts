import { getDefaultColor } from '../getDefaultColor.js';

test('GREY', () => {
  const image = testUtils.createGreyImage([
    [1, 1],
    [1, 1],
  ]);
  const expected = getDefaultColor(image);
  expect(expected).toStrictEqual([0]);
});

test('GREYA', () => {
  const image = testUtils.createGreyaImage([
    [1, 255, 1, 255],
    [1, 255, 1, 255],
  ]);
  const expected = getDefaultColor(image);
  expect(expected).toStrictEqual([0, 255]);
});

test('RBG', () => {
  const image = testUtils.createRgbImage([
    [1, 2, 255, 1, 15, 255],
    [1, 255, 10, 1, 22, 255],
  ]);
  const expected = getDefaultColor(image);
  expect(expected).toStrictEqual([0, 0, 0]);
});

test('RBGA', () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 5, 255, 1, 15, 22, 255],
    [1, 10, 55, 255, 10, 1, 22, 255],
  ]);
  const expected = getDefaultColor(image);
  expect(expected).toStrictEqual([0, 0, 0, 255]);
});
