import { IJS, ImageColorModel } from '../../src';
import { Mask } from '../../src/mask/Mask';

describe('toMatchImage', () => {
  it('should load and match', () => {
    const image1 = testUtils.load('opencv/test.png');
    expect(image1).toMatchImage('opencv/test.png');
  });

  it('should match identical images', () => {
    const image1 = new IJS(1, 1);
    const image2 = new IJS(1, 1);
    expect(image1).toMatchImage(image2);
  });

  it('should throw if the same instance is passed', () => {
    const image = new IJS(1, 1);
    expect(() => expect(image).toMatchImage(image)).toThrow(
      /Expected image instances to be different/,
    );
  });

  it('should throw if width is different', () => {
    const image1 = new IJS(1, 1);
    const image2 = new IJS(2, 1);
    expect(() => expect(image1).toMatchImage(image2)).toThrow(/width/);
  });

  it('should throw if height is different', () => {
    const image1 = new IJS(1, 1);
    const image2 = new IJS(1, 2);
    expect(() => expect(image1).toMatchImage(image2)).toThrow(/height/);
  });

  it('should throw if depth is different', () => {
    const image1 = new IJS(1, 1, { depth: 8 });
    const image2 = new IJS(1, 1, { depth: 16 });
    expect(() => expect(image1).toMatchImage(image2)).toThrow(/depth/);
  });

  it('should throw if color model is different', () => {
    const image1 = new IJS(1, 1, { colorModel: ImageColorModel.GREY });
    const image2 = new IJS(1, 1, { colorModel: ImageColorModel.RGB });
    expect(() => expect(image1).toMatchImage(image2)).toThrow(/color model/);
  });

  it('should throw if data is different', () => {
    const image1 = new IJS(2, 3);
    const image2 = new IJS(2, 3);
    image2.setValue(1, 0, 0, 128);
    image2.setValue(2, 0, 0, 255);
    expect(() => expect(image1).toMatchImage(image2)).toThrow(
      /Expected pixel at \(0, 1\) to be \[128, 0, 0\], but got \[0, 0, 0\]/,
    );
  });
});

describe('toMatchImageData', () => {
  it('should work with 2D array', () => {
    const image = new IJS(2, 2, {
      colorModel: ImageColorModel.GREY,
      data: Uint8Array.of(1, 2, 3, 4),
    });
    expect(image).toMatchImageData([
      [1, 2],
      [3, 4],
    ]);
  });

  it('should work with string', () => {
    const image = new IJS(2, 2, {
      colorModel: ImageColorModel.GREY,
      data: Uint8Array.of(1, 2, 3, 4),
    });
    expect(image).toMatchImageData(`
      1 2 
      3 4
    `);
  });
});

describe('toMatchMask', () => {
  it('should match identical masks', () => {
    const mask1 = new Mask(1, 1);
    const mask2 = new Mask(1, 1);
    expect(mask1).toMatchMask(mask2);
  });

  it('should throw if width is different', () => {
    const mask1 = new Mask(1, 1);
    const mask2 = new Mask(2, 1);
    expect(() => expect(mask1).toMatchMask(mask2)).toThrow(/width/);
  });

  it('should throw if height is different', () => {
    const mask1 = new Mask(1, 1);
    const mask2 = new Mask(1, 2);
    expect(() => expect(mask1).toMatchMask(mask2)).toThrow(/height/);
  });

  it('should throw if data is different', () => {
    const mask1 = new Mask(2, 3);
    const mask2 = new Mask(2, 3);
    mask2.setBit(1, 0, 1);
    mask2.setBit(2, 0, 1);
    expect(() => expect(mask1).toMatchMask(mask2)).toThrow(
      'Expected bit at (0, 1) to be 1, but got 0',
    );
  });
});

describe('toMatchMaskData', () => {
  it('should work with 2D array', () => {
    const mask = new Mask(2, 2, {
      data: Uint8Array.of(1, 1, 0, 0),
    });
    expect(mask).toMatchMaskData([
      [1, 1],
      [0, 0],
    ]);
  });

  it('should work with string', () => {
    const mask = new Mask(2, 2, {
      data: Uint8Array.of(1, 1, 0, 0),
    });
    expect(mask).toMatchMaskData(`
        1 1 
        0 0
      `);
  });
});
