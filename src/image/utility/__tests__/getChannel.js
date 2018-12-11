import { Image } from 'test/common';

describe('get a specific channel from an image', function () {
  it('should check channels from a RGBA image', function () {
    let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 240]);

    let red = image.getChannel('r');
    let green = image.getChannel(1);
    let blue = image.getChannel(2);
    let alpha = image.getChannel('a');


    expect(red.components).toBe(1);
    expect(red.channels).toBe(1);
    expect(red.bitDepth).toBe(8);
    expect(Array.from(red.data)).toStrictEqual([230, 100]);

    expect(green.components).toBe(1);
    expect(green.channels).toBe(1);
    expect(green.bitDepth).toBe(8);
    expect(Array.from(green.data)).toStrictEqual([83, 140]);

    expect(blue.components).toBe(1);
    expect(blue.channels).toBe(1);
    expect(blue.bitDepth).toBe(8);
    expect(Array.from(blue.data)).toStrictEqual([120, 13]);

    expect(alpha.components).toBe(1);
    expect(alpha.channels).toBe(1);
    expect(alpha.bitDepth).toBe(8);
    expect(Array.from(alpha.data)).toStrictEqual([255, 240]);
  });

  it('should check channels from a RGBA image with join alpha', function () {
    let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 0]);

    let red = image.getChannel('r', {
      mergeAlpha: true
    });

    expect(red.components).toBe(1);
    expect(red.alpha).toBe(0);
    expect(red.channels).toBe(1);
    expect(red.bitDepth).toBe(8);
    expect(Array.from(red.data)).toStrictEqual([230, 0]);
  });

  it('should check channels from a RGBA image with keep alpha', function () {
    let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 0]);

    let red = image.getChannel('r', {
      keepAlpha: true
    });

    expect(red.channels).toBe(2);
    expect(red.alpha).toBe(1);
    expect(red.components).toBe(1);
    expect(red.bitDepth).toBe(8);
    expect(Array.from(red.data)).toStrictEqual([230, 255, 100, 0]);
  });
});

