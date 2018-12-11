import { Image } from 'test/common';
import binary from 'test/binary';

describe('we check getPixelsGrid', function () {
  it('should yield the right array of pixels in presence of a mask', function () {
    let size = 6;
    let data = new Array(size * size);
    for (let i = 0; i < data.length; i++) {
      data[i] = i;
    }
    let image = new Image(size, size, data, { kind: 'GREY' });
    const maskData = binary`
        000000
        010010
        000000
        000000
        000000
        000000
    `;

    let mask = new Image(size, size, maskData, { kind: 'BINARY' });
    let pixels = image.getPixelsGrid({
      sampling: [2, 2],
      painted: false,
      mask: mask
    });

    expect(pixels.xyS).toStrictEqual([[1, 1], [4, 1]]);
    expect(pixels.zS).toStrictEqual([[7], [10]]);
    expect(typeof pixels.painted).toBe('undefined');
  });
});

