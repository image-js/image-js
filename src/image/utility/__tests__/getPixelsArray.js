import { Image, getSquare } from 'test/common';

describe('getPixelsArray', function () {
  it('should work with grey images', function () {
    const data = [
      0, 0, 0, 0, 0,
      0, 1, 1, 1, 1,
      0, 1, 2, 2, 2,
      0, 1, 3, 3, 3
    ];
    let image = new Image(5, 4, data,
      { kind: 'GREY' }
    );

    let array = image.getPixelsArray();
    expect(array).toStrictEqual(data.map((x) => [x]));
  });

  it('should work with RGB images', function () {
    const square = getSquare();
    let array = square.getPixelsArray();
    expect(array).toStrictEqual([
      [0,  0,  255],
      [0,  255, 0],
      [255, 0,  0],
      [255, 255, 0],
      [255, 0,  255],
      [0,  255, 255],
      [0,  0,  0],
      [255, 255, 255],
      [127, 127, 127]
    ]);
  });
});
