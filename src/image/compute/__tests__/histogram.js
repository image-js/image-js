import { Image } from 'test/common';

describe('calculate the histogram', function () {
  it('check 16 slots histogram', function () {
    let image = new Image(1, 4, [230, 255, 230, 255, 230, 255, 13, 1], {
      kind: 'GREYA'
    });

    let histogram = image.getHistogram({ maxSlots: 16 });

    expect(histogram[0]).toBeCloseTo(0.0039, 0.0001);
    expect(histogram[1]).toBe(0);
    expect(histogram[14]).toBe(3);
    expect(histogram[15]).toBe(0);
  });
});
