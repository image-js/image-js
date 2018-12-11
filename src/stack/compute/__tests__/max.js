import { Image, Stack } from 'test/common';

describe('check stack max method', function () {
  it('should return global maximal for GREY image', function () {
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

    expect(images.getMax()).toStrictEqual([7]);
  });


  it('should return global maximal for RGBA image', function () {
    let images = new Stack();

    images.push(
      new Image(2, 1,
        [
          1, 2, 3, 4,
          5, 6, 12, 8
        ]
      )
    );

    images.push(
      new Image(2, 1,
        [
          2, 3, 1, 5,
          10, 7, 8, 9
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

    expect(images.getMax()).toStrictEqual([10, 8, 12, 10]);
  });
});

