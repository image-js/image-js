import { Image } from '../../src';
import { Mask } from '../../src/Mask';

describe('toMatchImage', () => {
  it('should load and match', () => {
    const image1 = testUtils.load('opencv/test.png');
    expect(image1).toMatchImage('opencv/test.png');
  });

  it('should match identical images', () => {
    const image1 = new Image(1, 1);
    const image2 = new Image(1, 1);
    expect(image1).toMatchImage(image2);
  });

  it('should throw if the same instance is passed', () => {
    const image = new Image(1, 1);
    expect(() => expect(image).toMatchImage(image)).toThrow(
      /Expected image instances to be different/,
    );
  });

  it('should throw if width is different', () => {
    const image1 = new Image(1, 1);
    const image2 = new Image(2, 1);
    expect(() => expect(image1).toMatchImage(image2)).toThrow(/width/);
  });

  it('should throw if height is different', () => {
    const image1 = new Image(1, 1);
    const image2 = new Image(1, 2);
    expect(() => expect(image1).toMatchImage(image2)).toThrow(/height/);
  });

  it('should throw if depth is different', () => {
    const image1 = new Image(1, 1, { depth: 8 });
    const image2 = new Image(1, 1, { depth: 16 });
    expect(() => expect(image1).toMatchImage(image2)).toThrow(/depth/);
  });

  it('should throw if color model is different', () => {
    const image1 = new Image(1, 1, { colorModel: 'GREY' });
    const image2 = new Image(1, 1, { colorModel: 'RGB' });
    expect(() => expect(image1).toMatchImage(image2)).toThrow(/color model/);
  });

  it('should throw if data is different', () => {
    const image1 = new Image(2, 3);
    const image2 = new Image(2, 3);
    image2.setValue(0, 1, 0, 128);
    image2.setValue(0, 2, 0, 255);
    expect(() => expect(image1).toMatchImage(image2)).toThrow(
      /Expected pixel at \(0, 1\) to be \[128, 0, 0\], but got \[0, 0, 0\]/,
    );
  });
  it('error range of 1', () => {
    const received = testUtils.createGreyImage([[1, 2, 3, 4]]);
    const expected = testUtils.createGreyImage([[1, 2, 3, 50]]);
    expected.setValue(0, 1, 0, 128);
    expected.setValue(0, 1, 0, 255);
    expect(() => expect(received).toMatchImage(expected, { error: 1 })).toThrow(
      /Expected value at \(3, 0\) to be in range \[49,51\], but got 4/,
    );
  });
});

describe('toMatchImageData', () => {
  it('should work with 2D array', () => {
    const image = new Image(2, 2, {
      colorModel: 'GREY',
      data: Uint8Array.of(1, 2, 3, 4),
    });
    expect(image).toMatchImageData([
      [1, 2],
      [3, 4],
    ]);
  });

  it('should work with string', () => {
    const image = new Image(2, 2, {
      colorModel: 'GREY',
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
    mask2.setBit(0, 1, 1);
    mask2.setBit(0, 2, 1);
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
