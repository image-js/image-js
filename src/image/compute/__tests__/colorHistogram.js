import { Image } from 'test/common';

describe('calculate the colorHistogram', function () {
  it('check getColorHistogram method', function () {
    let image = new Image(1, 2, [0, 0, 0, 255, 255, 255, 255, 255]);

    let histogram = image.getColorHistogram({ useAlpha: false, nbSlots: 8 });
    expect(Array.from(histogram)).toStrictEqual([1, 0, 0, 0, 0, 0, 0, 1]);

    histogram = image.getColorHistogram({ useAlpha: true, nbSlots: 8 });
    expect(Array.from(histogram)).toStrictEqual([1, 0, 0, 0, 0, 0, 0, 1]);

    expect(function () {
      image.getColorHistogram({ nbSlots: 3 });
    }).toThrow(/nbSlots must be a power of 8/);
  });

  it('check getColorHistogram method with transparency', function () {
    let image = new Image(1, 2, [0, 0, 0, 255, 255, 255, 255, 0]);

    let histogram = image.getColorHistogram({ useAlpha: false, nbSlots: 8 });
    expect(Array.from(histogram)).toStrictEqual([1, 0, 0, 0, 0, 0, 0, 1]);

    histogram = image.getColorHistogram({ useAlpha: true, nbSlots: 8 });
    expect(Array.from(histogram)).toStrictEqual([1, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('check getColorHistogram property with transparency', function () {
    let image = new Image(1, 4, [0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 255, 255, 255, 255, 255]);

    let histogram = image.colorHistogram;
    expect(Array.from(histogram)).toHaveLength(512);
    expect(Array.from(histogram)[0]).toBe(2);
    expect(Array.from(histogram)[511]).toBe(1);
  });
});
