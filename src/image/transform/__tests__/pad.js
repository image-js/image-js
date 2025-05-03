import binary from 'test/binary';
import { Image } from 'test/common';

describe('check the pad transform', function () {
  it('check the right pad extract for a BINARY image', function () {
    let image = new Image(5, 5, [0x03, 0x9c, 0xe0, 0x00], { kind: 'BINARY' });

    let expected = binary`
    00000
    01110
    01110
    01110
    00000
  `;

    expect(image.pad().data).toStrictEqual(expected.data);

    expected = binary`
    0000000
    0000000
    0011100
    0011100
    0011100
    0000000
    0000000
  `;
    expect(image.pad({ size: 1 }).data).toStrictEqual(expected.data);

    expected = binary`
    0000000
    0000000
    0000000
    0011100
    0011100
    0011100
    0000000
    0000000
    0000000
  `;
    expect(image.pad({ size: [1, 2] }).data).toStrictEqual(expected.data);
  });

  it('check the right pad extract for GREY image', function () {
    let image = new Image(2, 2, [1, 2, 3, 4], { kind: 'GREY' });

    expect(Array.from(image.pad().data)).toStrictEqual([1, 2, 3, 4]);

    expect(Array.from(image.pad({ size: 1 }).data)).toStrictEqual([
      1, 1, 2, 2, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 4, 4,
    ]);

    expect(
      Array.from(image.pad({ size: 1, algorithm: 'set', color: 0 }).data),
    ).toStrictEqual([0, 0, 0, 0, 0, 1, 2, 0, 0, 3, 4, 0, 0, 0, 0, 0]);

    expect(Array.from(image.pad({ size: 2 }).data)).toStrictEqual([
      1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 3,
      3, 3, 4, 4, 4, 3, 3, 3, 4, 4, 4,
    ]);

    expect(
      Array.from(image.pad({ algorithm: 'set', size: 1, color: [9] }).data),
    ).toStrictEqual([9, 9, 9, 9, 9, 1, 2, 9, 9, 3, 4, 9, 9, 9, 9, 9]);
  });

  it('check the right pad extract for RGB image', function () {
    let image = new Image(2, 2, [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4], {
      kind: 'RGB',
    });

    expect(Array.from(image.pad().data)).toStrictEqual([
      1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4,
    ]);

    expect(Array.from(image.pad({ size: 1 }).data)).toStrictEqual([
      1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3,
      3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4,
    ]);

    expect(
      Array.from(
        image.pad({ algorithm: 'set', size: 2, color: [15, 15, 15] }).data,
      ),
    ).toStrictEqual([
      15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
      15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
      15, 15, 15, 15, 15, 15, 1, 1, 1, 2, 2, 2, 15, 15, 15, 15, 15, 15, 15, 15,
      15, 15, 15, 15, 3, 3, 3, 4, 4, 4, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
      15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
      15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    ]);

    expect(function () {
      image.pad({ algorithm: 'set', size: 1, color: [0, 1] });
    }).toThrow(/the color array must at least have the same/);
  });
});
