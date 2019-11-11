import { Image } from 'test/common';

describe('check the convolution operator', function () {
  it('check the convolution for GREY image', function () {
    let image = new Image(
      4,
      4,
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      { kind: 'GREY' }
    );

    expect(Array.from(image.convolution([1]).data)).toStrictEqual([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ]);

    expect(
      Array.from(image.convolution([1], { algorithm: 'fft' }).data)
    ).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

    expect(Array.from(image.convolution([[1]]).data)).toStrictEqual([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ]);

    expect(
      Array.from(image.convolution([[1]], { algorithm: 'fft' }).data)
    ).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

    expect(function () {
      image.convolution([1, 2, 3]);
    }).toThrow(/array should be a square/);

    expect(function () {
      image.convolution([[1], [1, 2, 3]]);
    }).toThrow(/rows and columns should be odd number/);
  });

  it('check the convolution for GREY image 16 bits', function () {
    let image = new Image(
      4,
      4,
      [
        100,
        200,
        300,
        400,
        500,
        600,
        700,
        800,
        900,
        1000,
        1100,
        1200,
        1300,
        1400,
        1500,
        1600
      ],
      { kind: 'GREY', bitDepth: 16 }
    );

    expect(
      Array.from(image.convolution([[1]], { algorithm: 'fft' }).data)
    ).toStrictEqual([
      100,
      200,
      300,
      400,
      500,
      600,
      700,
      800,
      900,
      1000,
      1100,
      1200,
      1300,
      1400,
      1500,
      1600
    ]);
  });

  it('check the convolution for GREY image 3 x 3 kernel', function () {
    let image = new Image(
      4,
      4,
      [1, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 1],
      { kind: 'GREY' }
    );

    expect(
      Array.from(image.convolution([1, 1, 1, 1, 1, 1, 1, 1, 1]).data)
    ).toStrictEqual([
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13
    ]);

    expect(
      Array.from(
        image.convolution([1, 1, 1, 1, 1, 1, 1, 1, 1], { algorithm: 'fft' })
          .data
      )
    ).toStrictEqual([
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13
    ]);
  });

  it('check the convolution non square for GREY image - matrix kernel', function () {
    let image = new Image(
      4,
      4,
      [1, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 1],
      { kind: 'GREY' }
    );

    expect(Array.from(image.convolution([[1, 2, 1]]).data)).toStrictEqual([
      4,
      4,
      4,
      4,
      7,
      7,
      7,
      7,
      7,
      7,
      7,
      7,
      4,
      4,
      4,
      4
    ]);

    expect(
      Array.from(image.convolution([[1, 2, 1]], { algorithm: 'fft' }).data)
    ).toStrictEqual([4, 4, 4, 4, 7, 7, 7, 7, 7, 7, 7, 7, 4, 4, 4, 4]);

    expect(
      Array.from(image.convolution([[1, 2, 1]], { divisor: 4 }).data)
    ).toStrictEqual([1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1]);

    expect(
      Array.from(
        image.convolution([[1, 2, 1]], { divisor: 4, algorithm: 'fft' }).data
      )
    ).toStrictEqual([1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1]);

    expect(
      Array.from(image.convolution([[1, 2, 1]], { normalize: true }).data)
    ).toStrictEqual([1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1]);

    expect(
      Array.from(
        image.convolution([[1, 2, 1]], { normalize: true, algorithm: 'fft' })
          .data
      )
    ).toStrictEqual([1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1]);
  });

  it('check the convolution for GREYA image', function () {
    let image = new Image(
      3,
      3,
      [1, 255, 2, 255, 3, 255, 4, 255, 5, 255, 6, 255, 7, 255, 8, 255, 9, 255],
      { kind: 'GREYA' }
    );

    expect(Array.from(image.convolution([1]).data)).toStrictEqual([
      1,
      255,
      2,
      255,
      3,
      255,
      4,
      255,
      5,
      255,
      6,
      255,
      7,
      255,
      8,
      255,
      9,
      255
    ]);

    expect(
      Array.from(image.convolution([1], { algorithm: 'fft' }).data)
    ).toStrictEqual([
      1,
      255,
      2,
      255,
      3,
      255,
      4,
      255,
      5,
      255,
      6,
      255,
      7,
      255,
      8,
      255,
      9,
      255
    ]);

    expect(Array.from(image.convolution([[1]]).data)).toStrictEqual([
      1,
      255,
      2,
      255,
      3,
      255,
      4,
      255,
      5,
      255,
      6,
      255,
      7,
      255,
      8,
      255,
      9,
      255
    ]);

    expect(
      Array.from(image.convolution([[1]], { algorithm: 'fft' }).data)
    ).toStrictEqual([
      1,
      255,
      2,
      255,
      3,
      255,
      4,
      255,
      5,
      255,
      6,
      255,
      7,
      255,
      8,
      255,
      9,
      255
    ]);

    expect(function () {
      image.convolution([1, 2, 3]);
    }).toThrow(/array should be a square/);

    expect(function () {
      image.convolution([[1], [1, 2, 3]]);
    }).toThrow(/rows and columns should be odd number/);
  });
});
