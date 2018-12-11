import { Image } from 'test/common';

describe('combine specific channels from an image', function () {
  it('should check channels from a RGBA image', function () {
    let image = new Image(1, 2, [10, 20, 30, 255, 100, 110, 120, 0]);

    let combined = image.combineChannels(function (pixel) {
      return (pixel[0] + pixel[1] + pixel[2]) / 3;
    });

    expect(combined.components).toBe(1);
    expect(combined.channels).toBe(1);
    expect(combined.bitDepth).toBe(8);
    expect(Array.from(combined.data)).toStrictEqual([20, 110]);
  });

  it('should check channels from a RGBA image with join alpha', function () {
    let image = new Image(1, 2, [10, 20, 30, 255, 100, 110, 120, 0]);

    let combined = image.combineChannels(function (pixel) {
      return (pixel[0] + pixel[1] + pixel[2]) / 3;
    }, {
      mergeAlpha: true
    });

    expect(combined.components).toBe(1);
    expect(combined.alpha).toBe(0);
    expect(combined.channels).toBe(1);
    expect(combined.bitDepth).toBe(8);
    expect(Array.from(combined.data)).toStrictEqual([20, 0]);
  });

  it('should check channels from a RGBA image with keep alpha', function () {
    let image = new Image(1, 2, [10, 20, 30, 255, 100, 110, 120, 0]);

    let combined = image.combineChannels(function (pixel) {
      return (pixel[0] + pixel[1] + pixel[2]) / 3;
    }, {
      keepAlpha: true
    });

    expect(combined.channels).toBe(2);
    expect(combined.alpha).toBe(1);
    expect(combined.components).toBe(1);
    expect(combined.bitDepth).toBe(8);
    expect(Array.from(combined.data)).toStrictEqual([20, 255, 110, 0]);
  });
});
