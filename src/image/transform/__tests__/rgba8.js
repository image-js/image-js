import { Image } from 'test/common';

describe('check the rgba8 transform', function () {
  it('check the right result for GREY image 8 bit', function () {
    let image = new Image(2, 1,
      [10, 20],
      { kind: 'GREY' }
    );

    let newImage = image.rgba8();

    expect(Array.from(newImage.data)).toStrictEqual([10, 10, 10, 255, 20, 20, 20, 255]);
  });

  it('check the right result for GREY A image 8 bit', function () {
    let image = new Image(2, 1,
      [10, 127, 20, 255],
      { kind: 'GREYA' }
    );

    let newImage = image.rgba8();

    expect(Array.from(newImage.data)).toStrictEqual([10, 10, 10, 127, 20, 20, 20, 255]);
  });

  it('check the right result for RGB A image 8 bit', function () {
    let image = new Image(2, 1,
      [10, 20, 30, 40, 50, 60],
      { kind: 'RGB' }
    );

    let newImage = image.rgba8();

    expect(Array.from(newImage.data)).toStrictEqual([10, 20, 30, 255, 40, 50, 60, 255]);
  });

  it('check the right result for RGB A image 16 bit', function () {
    let image = new Image(2, 1,
      [10 << 8, 20 << 8, 30 << 8, 40 << 8, 50 << 8, 60 << 8],
      { kind: 'RGB', bitDepth: 16 }
    );

    let newImage = image.rgba8();

    expect(Array.from(newImage.data)).toStrictEqual([10, 20, 30, 255, 40, 50, 60, 255]);
  });
});
