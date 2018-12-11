import { Image, Stack } from 'test/common';

describe('check stack histogram method', function () {
  it('should return global histogram for GREY image', function () {
    let images = new Stack();

    images.push(
      new Image(2, 2,
        [
          4, 170,
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
          1, 255,
          6, 7
        ],
        { kind: 'GREY' }
      )
    );

    expect(images.getHistogram({ maxSlots: 4 })).toStrictEqual([10, 0, 1, 1]);
  });


  it('should return global histogram for RGBA image', function () {
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

    expect(images.getHistogram({ maxSlots: 4, channel: 0 })).toStrictEqual([6, 0, 0, 0]);
  });
});

