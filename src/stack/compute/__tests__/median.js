import { Image, Stack } from 'test/common';

describe('check stack median method', function () {
  it('should return global median for GREY image', function () {
    let images = new Stack();

    images.push(
      new Image(2, 2,
        [
          1, 2,
          100, 101
        ],
        { kind: 'GREY' }
      )
    );

    images.push(
      new Image(2, 2,
        [
          2, 3,
          200, 201
        ],
        { kind: 'GREY' }
      )
    );

    images.push(
      new Image(2, 2,
        [
          4, 5,
          200, 240
        ],
        { kind: 'GREY' }
      )
    );

    expect(images.getMedian()).toStrictEqual([52.5]);
  });


  it('should return global median for RGBA image', function () {
    let images = new Stack();

    images.push(
      new Image(2, 1,
        [
          1, 2, 3, 255,
          5, 6, 12, 255
        ]
      )
    );

    images.push(
      new Image(2, 1,
        [
          2, 3, 1, 255,
          10, 7, 8, 255
        ]
      )
    );

    images.push(
      new Image(2, 1,
        [
          3, 1, 5, 255,
          7, 8, 9, 255
        ]
      )
    );

    expect(images.getMedian()).toStrictEqual([4, 4.5, 6.5]);
  });
});

