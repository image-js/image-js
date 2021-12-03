import { ColorDepth, ImageColorModel } from '../..';
import { Mask } from '../Mask';

describe('create new masks', () => {
  it('should create a 8-bit image', () => {
    const mask = new Mask(10, 20);
    expect(mask).toMatchObject({
      width: 10,
      height: 20,
      size: 200,
      depth: ColorDepth.UINT1,
      colorModel: ImageColorModel.BINARY,
      components: 3,
      channels: 3,
      alpha: false,
      maxValue: 255,
    });
    expect(mask.getRawImage().data).toHaveLength(600);
  });

  it('should throw on wrong width', () => {
    expect(() => new Mask(0, 1)).toThrow(
      /width must be an integer and at least 1. Received 0/,
    );
    expect(() => new Mask(0.5, 1)).toThrow(
      /width must be an integer and at least 1. Received 0.5/,
    );
  });

  it('should throw on wrong height', () => {
    expect(() => new Mask(1, 0)).toThrow(
      /height must be an integer and at least 1. Received 0/,
    );
    expect(() => new Mask(1, 0.5)).toThrow(
      /height must be an integer and at least 1. Received 0.5/,
    );
  });

  it('should throw on wrong data size', () => {
    const data = new Uint16Array(2);
    expect(() => new Mask(2, 2, { data })).toThrow(
      /incorrect data size: 2. Expected 12/,
    );
  });
});
describe('get and set bit', () => {
  it('should get and set', () => {
    const mask = new Mask(10, 20);
    expect(mask.getBit(15, 5)).toBe(0);
    mask.setBit(15, 5, 1);
    expect(mask.getBit(15, 5)).toBe(1);

    it('should get and set by index', () => {
      const mask = new Mask(10, 20);
      expect(mask.getBitByIndex(15)).toBe(0);
      mask.setBitByIndex(15, 1);
      expect(mask.getBitByIndex(15)).toBe(1);
    });
  });
});
test('fill with a a value', () => {
  const mask = new Mask(2, 2);
  mask.fill(1);
  expect(mask).toMatchImageData([
    [1, 1],
    [1, 1],
  ]);
});
