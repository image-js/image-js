import { ColorDepth, ImageColorModel } from '../..';
import { Mask } from '../Mask';

describe('create new masks', () => {
  it('should create a 8-bit image', () => {
    const img = new Mask(10, 20);
    expect(img).toMatchObject({
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
    expect(img.getRawImage().data).toHaveLength(600);
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
    const img = new Mask(10, 20);
    expect(img.getBit(15, 5)).toBe(0);
    img.setBit(15, 5, 1);
    expect(img.getBit(15, 5)).toBe(1);

    it('should get and set by index', () => {
      const img = new Mask(10, 20);
      expect(img.getBitByIndex(15)).toBe(0);
      img.setBitByIndex(15, 5);
      expect(img.getBitByIndex(15)).toBe(50);
    });
  });
});
