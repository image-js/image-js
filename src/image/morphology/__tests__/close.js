import { Image } from 'test/common';
import binary from 'test/binary';

import Matrix from 'ml-matrix';


describe('check the close function', function () {
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

    expect(Array.from(image.close({ kernel }).data)).toStrictEqual([
      255, 255, 255, 255, 255,
      255, 0, 0, 0, 255,
      255, 0, 0, 0, 255,
      255, 0, 0, 0, 255,
      255, 255, 255, 255, 255
    ]);
  });

  it('check for GREY image 5x5 2 iterations', function () {
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

    expect(Array.from(image.close({ kernel, iterations: 2 }).data)).toStrictEqual([
      255, 255, 255, 255, 255,
      255, 0, 0, 0, 255,
      255, 0, 0, 0, 255,
      255, 0, 0, 0, 255,
      255, 255, 255, 255, 255
    ]);
  });

  it('check on 5x5 mask', function () {
    /*
     We will create the following mask
      ______
     |xx xx|
     |x   x|
     |x   x|
     |x   x|
     |xx xx|
     */

    let mask = new Image(5, 5, binary`
      11011
      10001
      10001
      10001
      11011
    `, { kind: 'BINARY' });

    expect(mask.close().data).toStrictEqual(
      binary`
        11111
        10001
        10001
        10001
        11111
    `);
  });
});

