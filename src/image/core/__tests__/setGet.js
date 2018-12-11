import { Image } from 'test/common';

describe('get and set ', function () {
  it('should test getPixel, getPixelXY and setPixel, setPixelXY', function () {
    let image = new Image(2, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    expect(image.getPixelXY(0, 0)).toStrictEqual([1, 2, 3, 4]);
    expect(image.getPixel(1)).toStrictEqual([5, 6, 7, 8]);
    expect(image.getPixel(2)).toStrictEqual([9, 10, 11, 12]);
    expect(image.getPixelXY(1, 1)).toStrictEqual([13, 14, 15, 16]);

    image.setPixel(0, [101, 102, 103, 104]);
    image.setPixelXY(1, 0, [201, 202, 203, 204]);
    image.setPixelXY(0, 1, [301, 302, 303, 304]);
    image.setPixel(3, [401, 402, 403, 404]);
    expect(image.data).toStrictEqual(
      [101, 102, 103, 104, 201, 202, 203, 204, 301, 302, 303, 304, 401, 402, 403, 404]
    );

    expect(image.getPixelXY(0, 0)).toStrictEqual([101, 102, 103, 104]);
    expect(image.getPixel(1)).toStrictEqual([201, 202, 203, 204]);
    expect(image.getPixel(2)).toStrictEqual([301, 302, 303, 304]);
    expect(image.getPixelXY(1, 1)).toStrictEqual([401, 402, 403, 404]);
  });

  it('should test getValueXY', function () {
    let image = new Image(2, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    expect(image.getValueXY(0, 0, 0)).toBe(1);
    expect(image.getValueXY(0, 0, 1)).toBe(2);
    expect(image.getValueXY(0, 0, 2)).toBe(3);
    expect(image.getValueXY(0, 0, 3)).toBe(4);
    expect(image.getValueXY(1, 0, 0)).toBe(5);
    expect(image.getValueXY(0, 1, 0)).toBe(9);
  });

  it('should test setValueXY', function () {
    let image = new Image(2, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    image.setValueXY(0, 0, 0, 100);
    image.setValueXY(0, 0, 1, 200);
    image.setValueXY(0, 0, 2, 300);
    image.setValueXY(0, 0, 3, 400);
    image.setValueXY(1, 0, 0, 500);
    image.setValueXY(0, 1, 0, 600);
    expect(image.data).toStrictEqual([100, 200, 300, 400, 500, 6, 7, 8, 600, 10, 11, 12, 13, 14, 15, 16]);
  });

  it('should test getValue', function () {
    let image = new Image(2, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    expect(image.getValue(0, 0)).toBe(1);
    expect(image.getValue(0, 1)).toBe(2);
    expect(image.getValue(0, 2)).toBe(3);
    expect(image.getValue(0, 3)).toBe(4);
    expect(image.getValue(1, 0)).toBe(5);
    expect(image.getValue(2, 0)).toBe(9);
    expect(image.getValue(3, 2)).toBe(15);
  });

  it('should test setValue', function () {
    let image = new Image(2, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    image.setValue(0, 0, 100);
    image.setValue(0, 1, 200);
    image.setValue(0, 2, 300);
    image.setValue(0, 3, 400);
    image.setValue(1, 0, 500);
    image.setValue(2, 0, 600);
    expect(image.data).toStrictEqual([100, 200, 300, 400, 500, 6, 7, 8, 600, 10, 11, 12, 13, 14, 15, 16]);
  });
});

