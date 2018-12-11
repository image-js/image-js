import { Image } from 'test/common';

describe('flipY', function () {
  it('should flip pixels vertically of all RGBA components for a [2,1] image', function () {
    let image = new Image(2, 1, [1, 2, 3, 4, 5, 6, 7, 8]);

    let flipped = [1, 2, 3, 4, 5, 6, 7, 8];

    image.flipY();
    expect(image.data).toStrictEqual(flipped);
  });
  it('should flip pixels vertically of all RGBA components for a [2,2] image', function () {
    let image = new Image(2, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

    let flipped = [9, 10, 11, 12, 13, 14, 15, 16, 1, 2, 3, 4, 5, 6, 7, 8];
    image.flipY();
    expect(image.data).toStrictEqual(flipped);
  });

  it('should flip pixels vertically of all RGBA components for a [3,2] image', function () {
    let image = new Image(3, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);

    let flipped = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    image.flipY();
    expect(image.data).toStrictEqual(flipped);
  });

  it('should flip pixels vertically of all RGBA components for a [2,3] image', function () {
    let image = new Image(2, 3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);

    let flipped = [17, 18, 19, 20, 21, 22, 23, 24, 9, 10, 11, 12, 13, 14, 15, 16, 1, 2, 3, 4, 5, 6, 7, 8];

    image.flipY();
    expect(image.data).toStrictEqual(flipped);
  });

  it('should flip pixels vertically of GREY image', function () {
    let image = new Image(2, 2, [1, 2, 3, 4],
      { kind: 'GREY' });

    let flipped = [3, 4, 1, 2];
    image.flipY();
    expect(image.data).toStrictEqual(flipped);
  });

  it('should flip pixels vertically of all CMYK components for a [2,2] image', function () {
    let image = new Image(2, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      { kind: 'CMYK' });

    let flipped = [9, 10, 11, 12, 13, 14, 15, 16, 1, 2, 3, 4, 5, 6, 7, 8];

    image.flipY();
    expect(image.data).toStrictEqual(flipped);
  });
});
