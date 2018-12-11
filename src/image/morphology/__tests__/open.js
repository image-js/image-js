import { Image } from 'test/common';

import Matrix from 'ml-matrix';

describe('check the open function', function () {
  it('check for GREY image 5x5', function () {
    let kernel = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
    let image = new Image(5, 5,
      [
        255, 255, 0, 255, 255,
        255, 0, 0, 0, 255,
        255, 0, 0, 0, 255,
        255, 0, 0, 0, 255,
        255, 255, 0, 255, 255
      ],
      { kind: 'GREY' }
    );

    expect(Array.from(image.open({ kernel }).data)).toStrictEqual([
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0
    ]);
  });

  it('check for GREY image 5x5 2 iterations', function () {
    let kernel = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
    let image = new Image(5, 5,
      [
        255, 255, 255, 255, 255,
        255, 255, 0, 255, 255,
        255, 0, 0, 0, 255,
        255, 255, 0, 255, 255,
        255, 255, 255, 255, 255
      ],
      { kind: 'GREY' }
    );

    expect(Array.from(image.open({ kernel, iterations: 2 }).data)).toStrictEqual([
      255, 255, 0, 255, 255,
      255, 255, 0, 255, 255,
      0, 0, 0, 0, 0,
      255, 255, 0, 255, 255,
      255, 255, 0, 255, 255
    ]);
  });
});

