import { Image } from 'test/common';

describe('check min / max', function () {
  it('should yield the correct arrays', function () {
    let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 1]);

    expect(image.min).toStrictEqual([100, 83, 13, 1]);
    expect(image.max).toStrictEqual([230, 140, 120, 255]);
    expect(image.getMin()).toStrictEqual([100, 83, 13, 1]);
    expect(image.getMax()).toStrictEqual([230, 140, 120, 255]);
  });
});

