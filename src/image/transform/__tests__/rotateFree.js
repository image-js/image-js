import { Image } from 'test/common';

import rotateFree from '../rotateFree';

describe('check the rotate transform with free rotation', function () {
  it('GREY image', function () {
    let image = new Image(
      5,
      5,
      [
        0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 2, 2, 2, 0, 1, 2, 4, 3, 0, 1, 2, 3,
        3,
      ],
      { kind: 'GREY' },
    );

    let result = image.rotate(45);

    expect(Array.from(result.data)).toStrictEqual([
      255, 255, 255, 0, 255, 255, 255, 255, 255, 0, 1, 0, 255, 255, 255, 0, 1,
      1, 1, 0, 255, 0, 1, 1, 2, 1, 1, 0, 255, 1, 2, 4, 2, 1, 255, 255, 255, 3,
      4, 3, 255, 255, 255, 255, 255, 3, 255, 255, 255,
    ]);
  });

  it('GREY image bilinear', function () {
    let image = new Image(
      5,
      5,
      [
        0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 2, 2, 2, 0, 1, 2, 4, 3, 0, 1, 2, 3,
        3,
      ],
      { kind: 'GREY' },
    );

    let result = image.rotate(45, { interpolation: 'bilinear' });

    expect(Array.from(result.data)).toStrictEqual([
      255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 255, 255, 255, 255,
      255, 0, 1, 0, 255, 255, 255, 0, 1, 2, 1, 0, 255, 0, 0, 2, 3, 2, 1, 0, 255,
      0, 0, 3, 2, 0, 255, 255, 255, 0, 0, 0, 255, 255,
    ]);
  });

  it('45 degrees binary bilinear', function () {
    const image = new Image(
      8,
      8,
      [0x00, 0x00, 0x3c, 0x3c, 0x3c, 0x3c, 0x00, 0x00],
      { kind: 'BINARY' },
    );

    const result = image.rotate(45, { interpolation: 'bilinear' });
    expect(Array.from(result.data)).toStrictEqual([
      251, 254, 63, 131, 226, 56, 226, 62, 35, 142, 35, 224, 254, 63, 239, 128,
    ]);
  });

  it('30 degrees binary', function () {
    const image = new Image(
      8,
      8,
      [0xff, 0xff, 0xc3, 0xdb, 0xdb, 0xc3, 0xff, 0xff],
      { kind: 'BINARY' },
    );

    const result = image.rotate(30);
    expect(Array.from(result.data)).toStrictEqual([
      255, 255, 255, 127, 207, 236, 243, 127, 63, 239, 255, 255, 240,
    ]);
  });

  it('invalid argument types', function () {
    expect(function () {
      const image = new Image(
        8,
        8,
        [0xff, 0xff, 0xc3, 0xdb, 0xdb, 0xc3, 0xff, 0xff],
        { kind: 'BINARY' },
      );
      rotateFree.call(image, '45°');
    }).toThrow(/degrees must be a number/);
  });
});
