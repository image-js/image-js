import { Image } from 'test/common';

describe('invert', function () {
  it('should invert colors of 3 components of RGBA, not alpha', function () {
    let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 240]);

    let expected = [25, 172, 135, 255, 155, 115, 242, 240];

    const inverted = image.invert();
    expect(inverted).not.toBe(image);
    expect(Array.from(inverted.data)).toStrictEqual(expected);
  });

  it('should invert grey of GREY image', function () {
    let image = new Image(2, 2, [1, 2, 3, 4], { kind: 'GREY' });

    let expected = [254, 253, 252, 251];

    const inverted = image.invert();
    expect(inverted).not.toBe(image);
    expect(Array.from(inverted.data)).toStrictEqual(expected);
  });

  it('should invert grey 16 bits of GREY image', function () {
    let image = new Image(2, 2, [1, 2, 3, 4], { kind: 'GREY', bitDepth: 16 });

    let expected = [65534, 65533, 65532, 65531];

    const inverted = image.invert();
    expect(inverted).not.toBe(image);
    expect(Array.from(inverted.data)).toStrictEqual(expected);
  });

  it('should invert data if BINARY image', function () {
    let data = Uint8Array.of(85);
    let image = new Image(2, 4, data, { kind: 'BINARY' });

    let expected = Uint8Array.of(170);

    const inverted = image.invert();
    expect(inverted).not.toBe(image);
    expect(inverted.data).toStrictEqual(expected);
  });

  it('should allow in-place modification', function () {
    let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 240]);

    let expected = [25, 172, 135, 255, 155, 115, 242, 240];
    const inverted = image.invert({ inPlace: true });
    expect(Array.from(inverted.data)).toStrictEqual(expected);
    expect(inverted).toBe(image);
  });

  it('should allow self out', function () {
    let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 240]);

    let expected = [25, 172, 135, 255, 155, 115, 242, 240];
    const inverted = image.invert({ out: image });
    expect(Array.from(inverted.data)).toStrictEqual(expected);
    expect(inverted).toBe(image);
  });

  it('should allow new out', function () {
    let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 240]);

    let expected = [25, 172, 135, 255, 155, 115, 242, 240];
    const out = new Image(1, 2);
    const inverted = image.invert({ out });
    expect(Array.from(inverted.data)).toStrictEqual(expected);
    expect(inverted).toBe(out);
  });

  it('should throw for wrong out', function () {
    let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 240]);

    const out = new Image(1, 2, { kind: 'GREY' });
    expect(() => image.invert({ out })).toThrow(/cannot use out\. Its components must be "3" \(found "1"\)/);
  });
});
