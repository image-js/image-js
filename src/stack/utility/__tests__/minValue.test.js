import { Image, Stack } from 'test/common';

test('stack getMinImage', function () {
  let images = new Stack();

  images.push(new Image(8, 1, [1, 2, 3, 4, 5, 6, 7, 8], { kind: 'GREY' }));

  images.push(new Image(8, 1, [2, 3, 4, 5, 7, 8, 9, 10], { kind: 'GREY' }));

  images.push(new Image(8, 1, [3, 4, 5, 6, 6, 7, 8, 9], { kind: 'GREY' }));

  expect(Array.from(images.getMinImage().data)).toStrictEqual([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8
  ]);
});
