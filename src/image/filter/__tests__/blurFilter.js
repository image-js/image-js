import { Image } from 'test/common';

describe('check the blur filter', function () {
  it('check for GREY image', function () {
    let image = new Image(5, 5,
      [
        1, 2, 3, 4, 5,
        1, 2, 3, 4, 5,
        1, 2, 3, 4, 5,
        1, 2, 3, 4, 5,
        1, 2, 3, 4, 5
      ],
      { kind: 'GREY' }
    );

    expect(Array.from(image.blurFilter().data)).toStrictEqual([
      2, 2, 3, 4, 4,
      2, 2, 3, 4, 4,
      2, 2, 3, 4, 4,
      2, 2, 3, 4, 4,
      2, 2, 3, 4, 4
    ]);
  });

  it('check for GREY image with large values', function () {
    let image = new Image(5, 5,
      [
        10, 2, 20, 4, 5,
        10, 2, 20, 4, 5,
        10, 2, 20, 4, 5,
        10, 2, 20, 4, 5,
        10, 2, 20, 4, 5
      ],
      { kind: 'GREY' }
    );

    expect(Array.from(image.blurFilter({ radius: 2 }).data)).toStrictEqual([
      8, 8, 8, 8, 8,
      8, 8, 8, 8, 8,
      8, 8, 8, 8, 8,
      8, 8, 8, 8, 8,
      8, 8, 8, 8, 8
    ]);
  });
});

