import binary from 'test/binary';
import { Image } from 'test/common';

describe('check the erode function', function () {
  it('check for GREY image 5x5', function () {
    let image = new Image(
      5,
      5,
      [
        255, 0, 255, 255, 255, 255, 0, 255, 255, 255, 255, 0, 255, 255, 255,
        255, 0, 255, 255, 255, 255, 0, 255, 255, 255,
      ],
      { kind: 'GREY' },
    );

    expect(Array.from(image.erode().data)).toStrictEqual([
      0, 0, 0, 255, 255, 0, 0, 0, 255, 255, 0, 0, 0, 255, 255, 0, 0, 0, 255,
      255, 0, 0, 0, 255, 255,
    ]);
  });

  it('check for another GREY image 5x5', function () {
    let image = new Image(
      5,
      5,
      [
        255, 255, 255, 255, 255, 255, 255, 0, 255, 255, 255, 0, 0, 0, 255, 255,
        255, 0, 255, 255, 255, 255, 255, 255, 255,
      ],
      { kind: 'GREY' },
    );

    const expected = [
      255, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0,
      0, 255,
    ];

    expect(Array.from(image.erode().data)).toStrictEqual(expected);
  });

  it('check for binary image 5x5', function () {
    let mask = binary`
      10111
      10111
      10111
      10111
      10111
    `;

    expect(mask.erode().data).toStrictEqual(
      binary`
        00011
        00011
        00011
        00011
        00011
      `.data,
    );
  });

  it('checks erode with 2 iterations', function () {
    let mask = binary`
      10111
      10111
      10111
      10111
      10111
    `;

    const expected = binary`
      00001
      00001
      00001
      00001
      00001
    `;

    expect(mask.erode({ iterations: 2 }).data).toStrictEqual(expected.data);
  });

  it('checks a 5x5 binary', function () {
    const mask = binary`
      11111
      11011
      10001
      11011
      11111
    `;

    expect(mask.erode().data).toStrictEqual(
      binary`
      10001
      00000
      00000
      00000
      10001
    `.data,
    );
  });

  it('checks another 5x5 binary', function () {
    const mask = binary`
      11011
      11011
      00000
      11011
      11011
    `;

    const expected = binary`
      10001
      00000
      00000
      00000
      10001
`;

    expect(mask.erode().data).toStrictEqual(expected.data);
  });

  it('checks from binary image 5x3 with vertical kernel', function () {
    const kernel = [[1, 1, 1]];
    const mask = binary`
      110
      100
      111
      001
      011
    `;

    const expected = binary`
      100
      100
      000
      001
      001
    `;

    expect(mask.erode({ kernel }).data).toStrictEqual(expected.data);
  });

  it('checks from binary image 5x5, kernel with holes', function () {
    const kernel = [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ];
    const mask = binary`
      11111
      11111
      11101
      11111
      11111
    `;

    const expected = binary`
      11111
      11000
      11010
      11000
      11111
    `;

    expect(mask.erode({ kernel }).data).toStrictEqual(expected.data);
  });
});
