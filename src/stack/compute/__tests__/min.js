import { Image, Stack } from 'test/common';

describe('check stack min method', function () {
  it('should return global minimal for GREY image', function () {
    let images = new Stack();

    images.push(
      new Image(2, 2,
        [
          4, 5,
          6, 7
        ],
        { kind: 'GREY' }
      )
    );

    images.push(
      new Image(2, 2,
        [
          2, 3,
          4, 5
        ],
        { kind: 'GREY' }
      )
    );

    images.push(
      new Image(2, 2,
        [
          1, 5,
          6, 7
        ],
        { kind: 'GREY' }
      )
    );

    expect(images.getMin()).toStrictEqual([1]);
  });


  it('should return global minimal for RGBA image', function () {
    let images = new Stack();

    images.push(
      new Image(2, 1,
        [
          1, 2, 3, 4,
          5, 6, 7, 8
        ]
      )
    );

    images.push(
      new Image(2, 1,
        [
          2, 3, 1, 5,
          6, 7, 8, 9
        ]
      )
    );

    images.push(
      new Image(2, 1,
        [
          3, 1, 5, 6,
          7, 8, 9, 10
        ]
      )
    );

    expect(images.getMin()).toStrictEqual([1, 1, 1, 4]);
  });
});

