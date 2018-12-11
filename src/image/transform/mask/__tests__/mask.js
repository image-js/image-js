import { Image } from 'test/common';

describe('Create mask from a GREY image', function () {
  it('From GREY image give a mask image', function () {
    let image = new Image(5, 1, [0, 63, 127, 191, 255], { kind: 'GREY' });

    expect(image.mask().data[0]).toBe(0b00011000);
    expect(image.mask({ threshold: 0.9 }).data[0]).toBe(0b00001000);
    expect(image.mask({ threshold: 128 }).data[0]).toBe(0b00011000);
    expect(image.mask({ threshold: '50%' }).data[0]).toBe(0b00011000);
    expect(image
      .mask({ threshold: '50%', invert: true })
      .data[0]).toBe(0b11100000);
    expect(image
      .mask({ algorithm: 'percentile' })
      .data[0]).toBe(0b01111000);
    (expect(function () {
      image.mask({ algorithm: 'XXX' });
    }).toThrow(/^unknown thresholding algorithm: XXX$/));
  });
});

describe('Create a mask from a greyA image', function () {
  let image = new Image(4, 1, [255, 255, 0, 255, 255, 0, 0, 0], {
    kind: 'GREYA'
  });

  it('should create a mask for a threshold of 0.5 using alpha channel', function () {
    let mask = image.mask({ threshold: 0.5 });

    expect(mask.channels).toBe(1);
    expect(mask.bitDepth).toBe(1);
    expect(mask.width).toBe(4);
    expect(mask.height).toBe(1);

    let data = mask.data;
    expect(data).toBeInstanceOf(Uint8Array);
    expect(data).toHaveLength(1);

    expect(data[0]).toBe(176);
  });

  it('should create a mask with invert: true using alpha channel', function () {
    let mask = image.mask({ invert: true });

    expect(mask.channels).toBe(1);
    expect(mask.bitDepth).toBe(1);
    expect(mask.width).toBe(4);
    expect(mask.height).toBe(1);

    let data = mask.data;
    expect(data).toBeInstanceOf(Uint8Array);
    expect(data).toHaveLength(1);

    expect(data[0]).toBe(64);
  });

  it('should create a mask not using alpha channel', function () {
    let mask = image.mask({ useAlpha: false });

    expect(mask.channels).toBe(1);
    expect(mask.bitDepth).toBe(1);
    expect(mask.width).toBe(4);
    expect(mask.height).toBe(1);

    let data = mask.data;
    expect(data).toBeInstanceOf(Uint8Array);
    expect(data).toHaveLength(1);

    expect(data[0]).toBe(0b10100000);
  });
});

describe('Create a mask from a greyA image using percentile algorithm', function () {
  it('should give the right result', function () {
    let image = new Image(4, 1, [0, 255, 63, 255, 127, 255, 255, 255], {
      kind: 'GREYA'
    });

    let mask = image.mask({
      algorithm: 'percentile',
      useAlpha: false,
      invert: false
    });

    expect(mask.channels).toBe(1);
    expect(mask.bitDepth).toBe(1);
    expect(mask.width).toBe(4);
    expect(mask.height).toBe(1);

    let data = mask.data;
    expect(data).toBeInstanceOf(Uint8Array);
    expect(data).toHaveLength(1);

    expect(data[0]).toBe(0b01110000);
  });
});
