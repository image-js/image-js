import { Image } from 'test/common';

describe('check the gaussian filter', function () {
  it('check for GREY image', function () {
    let image = new Image(5, 5,
      [
        10, 10, 10, 10, 10,
        10, 20, 20, 20, 10,
        10, 20, 30, 20, 10,
        10, 20, 20, 20, 10,
        10, 10, 10, 10, 10
      ],
      { kind: 'GREY' }
    );

    expect(Array.from(image.gaussianFilter().data)).toStrictEqual([
      16, 16, 19, 16, 16,
      16, 16, 19, 16, 16,
      19, 19, 23, 19, 19,
      16, 16, 19, 16, 16,
      16, 16, 19, 16, 16
    ]);
  });

  it('check for GREY image wider than taller', function () {
    let image = new Image(7, 5,
      [
        10, 10, 10, 10, 10, 10, 10,
        10, 10, 20, 20, 20, 10, 10,
        10, 10, 20, 30, 20, 10, 10,
        10, 10, 20, 20, 20, 10, 10,
        10, 10, 10, 10, 10, 10, 10
      ],
      { kind: 'GREY' }
    );

    expect(Array.from(image.gaussianFilter({ fft: false }).data)).toStrictEqual([
      12, 12, 16, 19, 16, 12, 12,
      12, 12, 16, 19, 16, 12, 12,
      12, 12, 19, 23, 19, 12, 12,
      12, 12, 16, 19, 16, 12, 12,
      12, 12, 16, 19, 16, 12, 12
    ]);

    expect(Array.from(image.gaussianFilter().data)).toStrictEqual([
      12, 12, 16, 19, 16, 12, 12,
      12, 12, 16, 19, 16, 12, 12,
      12, 12, 19, 23, 19, 12, 12,
      12, 12, 16, 19, 16, 12, 12,
      12, 12, 16, 19, 16, 12, 12
    ]);
  });

  it('check for GREY image taller than wider', function () {
    let image = new Image(5, 7,
      [
        10, 10, 10, 10, 10,
        10, 10, 10, 10, 10,
        10, 20, 20, 20, 10,
        10, 20, 30, 20, 10,
        10, 20, 20, 20, 10,
        10, 10, 10, 10, 10,
        10, 10, 10, 10, 10
      ],
      { kind: 'GREY' }
    );

    expect(Array.from(image.gaussianFilter({ fft: false }).data)).toStrictEqual([
      12, 12, 12, 12, 12,
      12, 12, 12, 12, 12,
      16, 16, 19, 16, 16,
      19, 19, 23, 19, 19,
      16, 16, 19, 16, 16,
      12, 12, 12, 12, 12,
      12, 12, 12, 12, 12
    ]);


    expect(Array.from(image.gaussianFilter().data)).toStrictEqual([
      12, 12, 12, 12, 12,
      12, 12, 12, 12, 12,
      16, 16, 19, 16, 16,
      19, 19, 23, 19, 19,
      16, 16, 19, 16, 16,
      12, 12, 12, 12, 12,
      12, 12, 12, 12, 12
    ]);
  });

  it('separable gaussian', function () {
    let image = new Image(5, 7,
      [
        10, 10, 10, 10, 10,
        10, 10, 10, 10, 10,
        10, 20, 20, 20, 10,
        10, 20, 30, 20, 10,
        10, 20, 20, 20, 10,
        10, 10, 10, 10, 10,
        10, 10, 10, 10, 10
      ],
      { kind: 'GREY' }
    );

    expect(Array.from(image.gaussianFilter({ algorithm: 'separable' }).data)).toStrictEqual([
      12, 12, 12, 12, 12,
      12, 12, 12, 12, 12,
      16, 16, 19, 16, 16,
      19, 19, 23, 19, 19,
      16, 16, 19, 16, 16,
      12, 12, 12, 12, 12,
      12, 12, 12, 12, 12
    ]);
  });

  it('xxx', function () {
    let image = new Image(5, 7,
      [
        255, 255, 255, 255, 255,
        255, 255, 255, 255, 255,
        255, 255, 255, 255, 255,
        255, 255, 255, 255, 255,
        255, 255, 255, 255, 255,
        255, 255, 255, 255, 255,
        255, 255, 255, 255, 255
      ],
      { kind: 'GREY' }
    );
    expect(Array.from(image.gaussianFilter({ algorithm: 'separable' }).data)).toStrictEqual([
      255, 255, 255, 255, 255,
      255, 255, 255, 255, 255,
      255, 255, 255, 255, 255,
      255, 255, 255, 255, 255,
      255, 255, 255, 255, 255,
      255, 255, 255, 255, 255,
      255, 255, 255, 255, 255
    ]);
  });
});
