import { Image } from 'test/common';

import fromWaterShed from '../fromWaterShed';

describe('Test WaterShed Roi generation', function () {
  it('basic', function () {
    let image = new Image(5, 5,
      [
        3, 3, 3, 3, 3,
        3, 2, 2, 2, 3,
        3, 2, 1, 2, 3,
        3, 2, 2, 2, 3,
        3, 3, 3, 3, 3
      ],
      { kind: 'GREY' }
    );
    let map = fromWaterShed.call(image);
    expect(Array.from(map.data)).toStrictEqual([
      1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
      1, 1, 1, 1, 1
    ]);
  });

  it('for a GREY image, and with a useless mask, looking for maxima', function () {
    let image = new Image(5, 5,
      [
        1, 1, 1, 1, 1,
        1, 2, 2, 2, 1,
        1, 2, 3, 2, 1,
        1, 2, 2, 2, 1,
        1, 1, 1, 1, 1

      ],
      { kind: 'GREY' }
    );
    let mask = new Image(5, 5, { kind: 'BINARY' });
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        mask.setBitXY(i, j);
      }
    }
    let map = fromWaterShed.call(image, {
      fillMaxValue: 2,
      mask: mask,
      invert: true
    });
    expect(Array.from(map.data)).toStrictEqual([
      0, 0, 0, 0, 0,
      0, 1, 1, 1, 0,
      0, 1, 1, 1, 0,
      0, 1, 1, 1, 0,
      0, 0, 0, 0, 0
    ]);
  });

  it('for a GREY image, and with a useless mask', function () {
    let image = new Image(10, 10,
      [
        3, 3, 3, 3, 3, 3, 3, 3, 4, 4,
        3, 3, 2, 2, 2, 3, 3, 3, 4, 4,
        4, 3, 2, 1, 2, 2, 3, 3, 4, 4,
        4, 3, 2, 2, 2, 2, 3, 3, 3, 4,
        4, 4, 4, 3, 2, 3, 3, 3, 3, 4,
        4, 4, 4, 3, 3, 3, 3, 3, 3, 3,
        4, 3, 3, 3, 3, 3, 2, 2, 2, 3,
        4, 4, 3, 3, 3, 3, 2, 1, 2, 2,
        4, 4, 4, 4, 3, 2, 2, 2, 2, 3,
        4, 4, 4, 4, 3, 3, 3, 3, 2, 3

      ],
      { kind: 'GREY' }
    );
    let mask = new Image(10, 10, { kind: 'BINARY' });
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        mask.clearBitXY(i, j);
      }
    }
    let map = fromWaterShed.call(image, { fillMaxValue: 2, mask: mask });
    expect(Array.from(map.data)).toStrictEqual([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
      0, 0, 1, 1, 1, 1, 0, 0, 0, 0,
      0, 0, 1, 1, 1, 1, 0, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 2, 2, 2, 0,
      0, 0, 0, 0, 0, 0, 2, 2, 2, 2,
      0, 0, 0, 0, 0, 2, 2, 2, 2, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 2, 0
    ]);
  });


  it('with 3 minimum, and a mask', function () {
    let image = new Image(10, 10,
      [
        3, 3, 3, 3, 3, 3, 3, 2, 2, 2,
        3, 3, 2, 2, 2, 3, 3, 2, 2, 4,
        4, 3, 2, 1, 2, 2, 3, 1, 2, 4,
        4, 3, 2, 2, 2, 2, 3, 3, 3, 4,
        4, 4, 4, 3, 2, 3, 3, 3, 3, 4,
        4, 4, 4, 3, 3, 3, 3, 3, 3, 3,
        4, 3, 3, 3, 3, 3, 2, 2, 2, 3,
        4, 4, 3, 3, 3, 3, 2, 1, 2, 2,
        4, 4, 4, 4, 3, 2, 2, 2, 2, 3,
        4, 4, 4, 4, 3, 3, 3, 3, 2, 3

      ],
      { kind: 'GREY' }
    );

    let mask = new Image(10, 10, { kind: 'BINARY' });
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (image.data[i + j * 10] !== 4) {
          mask.clearBitXY(i, j);
        } else {
          mask.setBitXY(i, j);
        }
      }
    }

    let map = fromWaterShed.call(image, { mask: mask });
    expect(Array.from(map.data)).toStrictEqual([
      1, 1, 1, 1, 1, 1, 2, 2, 2, 2,
      1, 1, 1, 1, 1, 1, 2, 2, 2, 0,
      0, 1, 1, 1, 1, 1, 2, 2, 2, 0,
      0, 1, 1, 1, 1, 1, 1, 2, 2, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 0,
      0, 0, 0, 3, 1, 3, 3, 3, 3, 3,
      0, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      0, 0, 3, 3, 3, 3, 3, 3, 3, 3,
      0, 0, 0, 0, 3, 3, 3, 3, 3, 3,
      0, 0, 0, 0, 3, 3, 3, 3, 3, 3
    ]);
  });
});
