import { Image, Stack } from 'test/common';

test('stack getAverageImage', function () {
  let images = new Stack();

  images.push(new Image(2, 1, [1, 2, 3, 4, 5, 6, 7, 8]));

  images.push(new Image(2, 1, [2, 3, 4, 5, 6, 7, 8, 9]));

  images.push(new Image(2, 1, [3, 4, 5, 6, 7, 8, 9, 10]));

  expect(Array.from(images.getAverageImage().data)).toStrictEqual([
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9
  ]);
});
