import { Image } from 'test/common';

describe('countAlphaPixels', function () {

  it('check countAlphaPixels property', function () {
    let image = new Image(1, 4, [
      0,
      0,
      0,
      255,
      255,
      255,
      255,
      0,
      0,
      0,
      0,
      255,
      255,
      255,
      255,
      255,
    ]);

    expect(image.countAlphaPixels({ alpha: 255 })).toBe(3);
  });
});
