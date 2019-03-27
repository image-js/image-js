import { readImage } from 'test/readFile';
import { decode, ColorDepth } from 'ijs';

describe('Load PNG', function () {
  it('auto decode png', async () => {
    const buffer = readImage('grey8.png');
    expect(() => decode(buffer)).not.toThrow();
    const decoded = decode(buffer);
    expect(decoded.depth).toStrictEqual(ColorDepth.UINT8);
  });
});

describe('invalid data format', () => {
  it('should throw for too small data', () => {
    expect(() => decode(new Uint8Array(0))).toThrow(/invalid data format/);
  });
  it('should throw for unknown data', () => {
    expect(() => decode(new Uint8Array(10))).toThrow(/invalid data format/);
  });
});
