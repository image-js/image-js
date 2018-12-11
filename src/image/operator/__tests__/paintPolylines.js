import { Image } from 'test/common';

describe('we check paintPolylines', function () {
  it('should yield the painted image with 2 lines', function () {
    let size = 5;
    let data = new Array(size * size * 3).fill(0);
    let image = new Image(size, size, data, { kind: 'RGB' });

    let polylines = [[[1, 1], [3, 1]], [[1, 3], [3, 3]]];
    image.paintPolylines(polylines, { colors: ['red', 'blue'] });

    let grey = image.grey();

    let expected = [
      0, 0, 0, 0, 0,
      0, 54, 54, 54, 0,
      0, 0, 0, 0, 0,
      0, 18, 18, 18, 0,
      0, 0, 0, 0, 0
    ];

    expect(Array.from(grey.data)).toStrictEqual(expected);
  });
});

