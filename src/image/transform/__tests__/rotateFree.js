import { Image } from 'test/common';

describe('check the rotate transform with free rotation', function () {
  it('GREY image', function () {
    let image = new Image(5, 5,
      [
        0, 0, 0, 0, 0,
        0, 1, 1, 1, 1,
        0, 1, 2, 2, 2,
        0, 1, 2, 4, 3,
        0, 1, 2, 3, 3
      ],
      { kind: 'GREY' }
    );

    let result = image.rotate(45);

    expect(Array.from(result.data)).toStrictEqual([
      255, 255, 255, 0, 255, 255, 255,
      255, 255,  0,  1,  0,  255, 255,
      255,  0,   1,  1,  1,   0,  255,
      0,   1,   1,  2,  1,   1,   0,
      255,   1,   2,  4,  2,   1,   255,
      255,  255,   3,  4,  3,   255,  255,
      255, 255,  255,  3,  255,  255, 255
    ]);
  });
});
