import { Image } from '../../../Image';
import { getIntensityCentroid } from '../getIntensityCentroid';

test('3x3 empty image', () => {
  const image = new Image(3, 3, { colorModel: 'GREY' });
  const result = getIntensityCentroid(image);
  expect(result).toStrictEqual([{ column: 0, row: 0 }]);
});

test('3x3 image', () => {
  const image = testUtils.createGreyImage([
    [1, 0, 3],
    [2, 0, 2],
    [3, 0, 1],
  ]);
  const result = getIntensityCentroid(image);
  expect(result).toStrictEqual([{ column: 0, row: 0 }]);
});

test('RGB image', () => {
  const image = testUtils.createRgbImage([
    [1, 1, 3],
    [2, 2, 2],
    [3, 1, 1],
  ]);
  const result = getIntensityCentroid(image);
  expect(result).toStrictEqual([
    { column: 0, row: 1 / 3 },
    { column: 0, row: 0 },
    { column: 0, row: -1 / 3 },
  ]);
});
