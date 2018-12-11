import { Image } from 'test/common';

describe('multiply', function () {
  it('should multiply a fix value to all channels of RGBA image, we dont touch alpha', function () {
    let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 240]);

    let newImage = [255, 166, 240, 255, 200, 255, 26, 240];

    image.multiply(2);
    expect(image.data).toStrictEqual(newImage);

    expect(function () {
      image.add(0);
    }).toThrow(/the value must be greater/);
  });
});

describe('divide', function () {
  it('should divide a fix value to all channels of RGBA image, we dont touch alpha', function () {
    let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 240]);

    let newImage = [115, 41, 60, 255, 50, 70, 6, 240];

    image.divide(2);
    expect(image.data).toStrictEqual(newImage);

    expect(function () {
      image.divide(0);
    }).toThrow(/the value must be greater/);
  });
});
