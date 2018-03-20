import { Image } from 'test/common';
import binary from 'test/binary';

describe('check moment', function () {
  it('should yield the correct moment', function () {
    const image = new Image(8, 2, binary`
      10000011
      10000000
    `, { kind: 'BINARY' });

    expect(image.getMoment()).toBe(4);
    expect(image.getMoment(0, 0)).toBe(4);
    expect(image.getMoment(1, 0)).toBe(13);
    expect(image.getMoment(0, 1)).toBe(1);
    expect(image.getMoment(1, 1)).toBe(0);
  });
});

