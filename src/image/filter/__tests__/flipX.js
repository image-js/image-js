import { Image } from 'test/common';

describe('flipX', function () {
  it('should flip pixels horizontally of all RGBA components for a [2,1] image', function () {
    let image = new Image(2, 1, [1, 2, 3, 4, 5, 6, 7, 8]);

    let flipped = [5, 6, 7, 8, 1, 2, 3, 4];

    image.flipX();
    expect(image.data).toStrictEqual(flipped);
  });

  it('should flip pixels horizontally of all RGBA components for a [2,2] image', function () {
    let image = new Image(2, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

    let flipped = [5, 6, 7, 8, 1, 2, 3, 4, 13, 14, 15, 16, 9, 10, 11, 12];
    image.flipX();
    expect(image.data).toStrictEqual(flipped);
  });

  it('should flip pixels horizontally of all RGBA components for a [3,2] image', function () {
    let image = new Image(3, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);

    let flipped = [9, 10, 11, 12, 5, 6, 7, 8, 1, 2, 3, 4, 21, 22, 23, 24, 17, 18, 19, 20, 13, 14, 15, 16];

    image.flipX();
    expect(image.data).toStrictEqual(flipped);
  });

  it('should flip pixels horizontally of GREY image', function () {
    let image = new Image(2, 2, [1, 2, 3, 4], { kind: 'GREY' });

    let flipped = [2, 1, 4, 3];
    image.flipX();
    expect(image.data).toStrictEqual(flipped);
  });

  it('should flip pixels horizontally of all CMYK components for a [2,2] image', function () {
    let image = new Image(2, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], { kind: 'CMYK' });

    let flipped = [5, 6, 7, 8, 1, 2, 3, 4, 13, 14, 15, 16, 9, 10, 11, 12];

    image.flipX();
    expect(image.data).toStrictEqual(flipped);
  });
});
