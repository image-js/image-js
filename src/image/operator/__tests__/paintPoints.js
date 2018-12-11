import { Image } from 'test/common';

describe('we check paintPoints', function () {
  it('should yield the painted image', function () {
    let size = 5;
    let data = new Array(size * size * 3);
    for (let i = 0; i < data.length; i++) {
      data[i] = i;
    }
    let image = new Image(size, size, data, { kind: 'RGB' });


    let points = [[1, 1], [3, 2]];
    image.paintPoints(points, { color: 'red', shape: { kind: 'smallCross' } });


    let marked = [
      0, 1, 0, 0, 0,
      1, 1, 1, 1, 0,
      0, 1, 1, 1, 1,
      0, 0, 0, 1, 0,
      0, 0, 0, 0, 0
    ];

    let result = new Array(size * size * 3);
    for (let i = 0; i < result.length; i++) {
      result[i] = i;
    }
    for (let i = 0; i < result.length / 3; i++) {
      if (marked[i] === 1) {
        result[i * 3] = 255;
        result[i * 3 + 1] = 0;
        result[i * 3 + 2] = 0;
      }
    }

    expect(Array.from(image.data)).toStrictEqual(result);
  });
});

