import { Image } from 'test/common';

describe('add', function () {
  it('should add a fix value to all channels of RGBA image, we dont touch alpha', function () {
    let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 240]);

    let newImage = [255, 183, 220, 255, 200, 240, 113, 240];

    image.add(100);
    expect(image.data).toStrictEqual(newImage);

    expect(function () {
      image.add(-10);
    }).toThrow(/the value must be greater/);

    expect(function () {
      image.add('abc');
    }).toThrow(/should be either a/);

    expect(function () {
      image.add([1, 2, 3]);
    }).toThrow(/the data size is different/);

    let image2 = new Image(1, 2, [1, 2, 3, 4, 5, 6, 7, 8]);
    // by default alpha is untouched
    expect(image2.add([1, 2, 3, 4, 5, 6, 7, 8]).data).toStrictEqual([2, 4, 6, 4, 10, 12, 14, 8]);
  });
});

describe('subtract', function () {
  it('should subtract a fix value to all channels of RGBA image, we dont touch alpha', function () {
    let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 240]);

    let newImage = [130, 0, 20, 255, 0, 40, 0, 240];

    image.subtract(100);
    expect(image.data).toStrictEqual(newImage);

    expect(function () {
      image.subtract(-10);
    }).toThrow(/the value must be greater/);
  });
});

describe('subtract image', function () {
  it('should subtract an image to another', function () {
    let image = new Image(5, 5,
      [
        0, 0, 255, 0, 255,
        0, 0, 255, 0, 255,
        0, 0, 255, 0, 255,
        0, 0, 255, 0, 255,
        0, 0, 255, 0, 255
      ],
      { kind: 'GREY' }
    );

    let image2 = new Image(5, 5,
      [
        255, 0, 0, 0, 255,
        255, 0, 0, 0, 255,
        255, 0, 0, 0, 255,
        255, 0, 0, 0, 255,
        255, 0, 0, 0, 255
      ],
      { kind: 'GREY' }
    );

    expect(Array.from(image.subtractImage(image2).data)).toStrictEqual([
      0, 0, 255, 0, 0,
      0, 0, 255, 0, 0,
      0, 0, 255, 0, 0,
      0, 0, 255, 0, 0,
      0, 0, 255, 0, 0
    ]);
  });
  it('should subtract an image to another with absolute = true', function () {
    let image = new Image(5, 5,
      [
        0, 0, 255, 0, 255,
        0, 0, 255, 0, 255,
        0, 0, 255, 0, 255,
        0, 0, 255, 0, 255,
        0, 0, 255, 0, 255
      ],
      { kind: 'GREY' }
    );

    let image2 = new Image(5, 5,
      [
        255, 0, 0, 0, 255,
        255, 0, 0, 0, 255,
        255, 0, 0, 0, 255,
        255, 0, 0, 0, 255,
        255, 0, 0, 0, 255
      ],
      { kind: 'GREY' }
    );

    expect(Array.from(image.subtractImage(image2, { absolute: true }).data)).toStrictEqual([
      255, 0, 255, 0, 0,
      255, 0, 255, 0, 0,
      255, 0, 255, 0, 0,
      255, 0, 255, 0, 0,
      255, 0, 255, 0, 0
    ]);
  });
});
