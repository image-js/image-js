import { Image } from 'test/common';

describe('getBackground filter', function () {
  it('grey image with 0 values', function () {
    let image = new Image(3, 3,
      [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
      ],
      { kind: 'GREY' }
    );
    let bg = image.background([[0, 0], [1, 1]], [[0], [0]]);
    expect(Array.from(bg.data)).toStrictEqual([
      0, 0, 0,
      0, 0, 0,
      0, 0, 0
    ]);
  });
});
