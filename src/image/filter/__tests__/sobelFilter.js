import { Image } from 'test/common';

describe('check the gaussian filter', function () {
  it('check for GREY image', function () {
    let image = new Image(7, 7,
      [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 9, 9, 9, 0, 0,
        0, 0, 9, 0, 9, 0, 0,
        0, 0, 9, 9, 9, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0
      ],
      { kind: 'GREY' }
    );

    let sobel = image.sobelFilter();
    expect(Array.from(sobel.data)).toStrictEqual([
      13, 13, 28, 36, 28, 13, 13,
      13, 13, 28, 36, 28, 13, 13,
      28, 28, 25, 18, 25, 28, 28,
      36, 36, 18, 0, 18, 36, 36,
      28, 28, 25, 18, 25, 28, 28,
      13, 13, 28, 36, 28, 13, 13,
      13, 13, 28, 36, 28, 13, 13
    ]);
  });


  it('check for GREY image large value', function () {
    let image = new Image(7, 7,
      [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 200, 200, 200, 0, 0,
        0, 0, 200,   0, 200, 0, 0,
        0, 0, 200, 200, 200, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0
      ],
      { kind: 'GREY' }
    );

    let sobel = image.sobelFilter({ bitDepth: 16 });

    expect(Array.from(sobel.data)).toStrictEqual([
      283, 283, 632, 800, 632, 283, 283,
      283, 283, 632, 800, 632, 283, 283,
      632, 632, 566, 400, 566, 632, 632,
      800, 800, 400,   0, 400, 800, 800,
      632, 632, 566, 400, 566, 632, 632,
      283, 283, 632, 800, 632, 283, 283,
      283, 283, 632, 800, 632, 283, 283
    ]);
  });
});

