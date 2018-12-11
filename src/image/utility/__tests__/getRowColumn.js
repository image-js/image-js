import { Image } from 'test/common';

describe('check getRow and getColumn class', function () {
  it('should yield the third row and third column for GREY image', function () {
    let image = new Image(5, 4,
      [
        0, 0, 0, 0, 0,
        0, 1, 1, 1, 1,
        0, 1, 2, 2, 2,
        0, 1, 3, 3, 3
      ],
      { kind: 'GREY' }
    );

    expect(image.getRow(2)).toStrictEqual([0, 1, 2, 2, 2]);
    expect(image.getColumn(2)).toStrictEqual([0, 1, 2, 3]);
  });

  it('should yield the first second and second column for GREY A image', function () {
    let image = new Image(3, 3,
      [
        0,  1,  2,  3,  4,  5,
        6,  7,  8,  9, 10, 11,
        12, 13, 14, 15, 16, 17
      ],
      { kind: 'GREYA' }
    );

    expect(image.getRow(1, 0)).toStrictEqual([6, 8, 10]);
    expect(image.getRow(1, 1)).toStrictEqual([7, 9, 11]);
    expect(image.getColumn(1, 0)).toStrictEqual([2, 8, 14]);
    expect(image.getColumn(1, 1)).toStrictEqual([3, 9, 15]);

    expect(function () {
      image.getRow(5);
    }).toThrow(/row must be included between 0 and 2/);

    expect(function () {
      image.getRow(1, 2);
    }).toThrow(/channel must be included between 0 and 1/);

    expect(function () {
      image.getColumn(5);
    }).toThrow(/column must be included between 0 and 2/);

    expect(function () {
      image.getColumn(1, 2);
    }).toThrow(/channel must be included between 0 and 1/);
  });
});

