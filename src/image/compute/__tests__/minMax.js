import { Image } from 'test/common';

describe('check min / max', function () {
  it('should yield the correct arrays', function () {
    let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 1]);

    expect(image.min).toEqual([100, 83, 13, 1]);
    expect(image.max).toEqual([230, 140, 120, 255]);
    expect(image.getMin()).toEqual([100, 83, 13, 1]);
    expect(image.getMax()).toEqual([230, 140, 120, 255]);
  });
});

