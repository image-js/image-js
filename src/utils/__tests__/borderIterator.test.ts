import { Image, Mask } from '../..';
import { borderIterator } from '../borderIterator';

test('3x4 image', () => {
  let image = new Image(4, 3);
  expect(getBorderPixels(image)).toStrictEqual([
    0, 1, 2, 3, 7, 11, 10, 9, 8, 4,
  ]);
});

test('5x4 image', () => {
  let image = new Image(3, 5);
  expect(getBorderPixels(image)).toStrictEqual([
    0, 1, 2, 5, 8, 11, 14, 13, 12, 9, 6, 3,
  ]);
});

function getBorderPixels(image: Image | Mask): number[] {
  let result = [];
  for (let i of borderIterator(image)) {
    result.push(i);
  }
  return result;
}
