import { Image } from 'test/common';

describe('calculate the histogram', function () {
  it('check getHistogram method', function () {
    let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 1]);

    let histogram = image.getHistogram({ useAlpha: false, channel: 0 });
    expect(histogram[0]).toBe(0);
    expect(histogram[100]).toBe(1);
    expect(histogram[230]).toBe(1);
    expect(histogram[255]).toBe(0);

    histogram = image.getHistogram({ useAlpha: false, channel: 2 });
    expect(histogram[0]).toBe(0);
    expect(histogram[13]).toBe(1);
    expect(histogram[120]).toBe(1);
    expect(histogram[255]).toBe(0);
  });


  it('check histogram property', function () {
    let image = new Image(1, 4, [230, 255, 230, 255, 230, 255, 13, 1], {
      kind: 'GREYA'
    });

    let histogram = image.histogram;

    expect(histogram[0]).toBe(0);
    expect(histogram[1]).toBe(0);
    expect(histogram[13]).toBeCloseTo(0.0039, 0.0001);
    expect(histogram[100]).toBe(0);
    expect(histogram[230]).toBe(3);
    expect(histogram[255]).toBe(0);
  });

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

  it('check histogram for 1 bit image', function () {
    let image = new Image(5, 5,
      [
        0, 0, 0, 0, 0,
        0, 255, 255, 255, 0,
        0, 255, 255, 255, 0,
        0, 255, 255, 255, 0,
        0, 0, 0, 0, 0
      ],
      { kind: 'GREY' }
    );
    let image2 = image.mask();
    let histogram = image2.getHistogram();
    expect(histogram[0]).toStrictEqual(16);
    expect(histogram[1]).toStrictEqual(9);
  });
});

