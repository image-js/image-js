import binary from 'test/binary';
import { Image } from 'test/common';

describe('check the dilate function', function () {
  it('check for GREY image 5x5', function () {
    let kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    let image = new Image(
      5,
      5,
      [
        255, 0, 0, 0, 255, 255, 0, 0, 0, 255, 255, 0, 0, 0, 255, 255, 0, 0, 0,
        255, 255, 0, 0, 0, 255,
      ],
      { kind: 'GREY' },
    );

    expect(Array.from(image.dilate({ kernel: kernel }).data)).toStrictEqual([
      255, 255, 0, 255, 255, 255, 255, 0, 255, 255, 255, 255, 0, 255, 255, 255,
      255, 0, 255, 255, 255, 255, 0, 255, 255,
    ]);
  });

  it('check for another GREY image 5x5', function () {
    let image = new Image(
      5,
      5,
      [
        255, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0,
        0, 0, 255,
      ],
      { kind: 'GREY' },
    );

    expect(Array.from(image.dilate().data)).toStrictEqual([
      255, 255, 0, 255, 255, 255, 255, 0, 255, 255, 0, 0, 0, 0, 0, 255, 255, 0,
      255, 255, 255, 255, 0, 255, 255,
    ]);
  });

  it('check for BINARY image 5x5', function () {
    const mask = binary`
      10001
      00000
      00000
      00000
      10001
    `;

    const expected = binary`
      11011
      11011
      00000
      11011
      11011
    `;

    expect(mask.dilate().data).toStrictEqual(expected.data);
  });
});
