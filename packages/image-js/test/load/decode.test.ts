import { readImage } from 'test';
import { decode, ColorDepth, ImageKind } from 'ijs';

describe('decode various formats', function () {
  it('auto decode png', async () => {
    const buffer = readImage('grey8.png');
    expect(() => decode(buffer)).not.toThrow();
    const decoded = decode(buffer);
    expect(decoded.depth).toStrictEqual(ColorDepth.UINT8);
    expect(decoded.kind).toStrictEqual(ImageKind.GREY);
  });

  it('auto decode jpeg', async () => {
    const buffer = readImage('rgb12.jpg');
    expect(() => decode(buffer)).not.toThrow();
    const decoded = decode(buffer);
    expect(decoded.depth).toStrictEqual(ColorDepth.UINT8);
    expect(decoded.kind).toStrictEqual(ImageKind.RGBA);
  });
});

describe('invalid data format', () => {
  it('should throw for too small data', () => {
    expect(() => decode(new Uint8Array(0))).toThrow(/unrecognized data format/);
  });
  it('should throw for unknown data', () => {
    expect(() => decode(new Uint8Array(10))).toThrow(
      /unrecognized data format/
    );
  });
});
