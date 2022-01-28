import { Mask } from '../..';
import { IJS, ColorDepth } from '../../IJS';
import { ImageColorModel } from '../colorModels';
import {
  getOutputImage,
  imageToOutputMask,
  maskToOutputImage,
  maskToOutputMask,
} from '../getOutputImage';

describe('getOutputImage', () => {
  it('should default to creating an empty image', () => {
    const img = testUtils.createGreyImage([
      [0, 1],
      [2, 3],
    ]);
    const output = getOutputImage(img);
    expect(output).toMatchObject({
      width: 2,
      height: 2,
      colorModel: ImageColorModel.GREY,
      depth: ColorDepth.UINT8,
    });
    expect(output).toMatchImageData([
      [0, 0],
      [0, 0],
    ]);
  });

  it('should clone image when out undefined', () => {
    const img = testUtils.createGreyImage([
      [0, 1],
      [2, 3],
    ]);
    const output = getOutputImage(img, {}, { clone: true });
    expect(output).toMatchObject({
      width: 2,
      height: 2,
      colorModel: ImageColorModel.GREY,
      depth: ColorDepth.UINT8,
    });
    expect(output).toMatchImageData([
      [0, 1],
      [2, 3],
    ]);
  });
  it('should clone data to out', () => {
    const img = testUtils.createGreyImage([
      [0, 1],
      [2, 3],
    ]);

    let out = testUtils.createGreyImage([
      [5, 6],
      [7, 8],
    ]);
    const output = getOutputImage(img, { out }, { clone: true });
    expect(out).toBe(output);
    expect(out).toMatchImage(img);
  });
  it('should create with requirements', () => {
    const img = new IJS(1, 2);
    const requirements = {
      colorModel: ImageColorModel.GREY,
    };
    const output = getOutputImage(img, {}, { newParameters: requirements });
    expect(output).toMatchObject({
      colorModel: ImageColorModel.GREY,
    });
  });

  it('should accept out with matching requirements', () => {
    const img = new IJS(1, 2);
    const requirements = {
      colorModel: ImageColorModel.GREY,
    };
    const correct = new IJS(1, 2, requirements);
    const output = getOutputImage(
      img,
      { out: correct },
      { newParameters: requirements },
    );
    expect(output).toBe(correct);
  });

  it('should throw with non-matching requirements', () => {
    const img = new IJS(1, 2);
    const requirements = {
      colorModel: ImageColorModel.GREY,
    };
    const incorrect = new IJS(1, 2);
    expect(() =>
      getOutputImage(img, { out: incorrect }, { newParameters: requirements }),
    ).toThrow(
      /cannot use out. Its colorModel property must be GREY. Found RGB/,
    );
  });

  it('should throw if out is not an image', () => {
    const img = new IJS(1, 2);
    // @ts-ignore
    expect(() => getOutputImage(img, { out: 'str' })).toThrow(
      /out must be an IJS object/,
    );
  });
});

describe('maskToOutputImage', () => {
  it('should default to creating an empty image', () => {
    const mask = new Mask(2, 2);
    const output = maskToOutputImage(mask);
    expect(output).toMatchObject({
      width: 2,
      height: 2,
      colorModel: ImageColorModel.GREY,
      depth: ColorDepth.UINT8,
    });
    expect(output).toMatchImageData([
      [0, 0],
      [0, 0],
    ]);
  });
  it('providing valid out', () => {
    const img = new Mask(1, 2);
    const out = new IJS(1, 2, { colorModel: ImageColorModel.GREY });
    const output = maskToOutputImage(img, { out });
    expect(output).toBe(out);
  });
  it('providing invalid out', () => {
    const img = new Mask(1, 2);
    const out = new IJS(2, 2, { colorModel: ImageColorModel.GREY });
    expect(() => {
      maskToOutputImage(img, { out });
    }).toThrow(/cannot use out. Its width property must be 1. Found 2/);
  });
  it('should throw if out is not an image', () => {
    const img = new IJS(1, 2);
    // @ts-ignore
    expect(() => maskToOutputImage(img, { out: 'str' })).toThrow(
      /out must be an IJS object/,
    );
  });
});

describe('imageToOutputMask', () => {
  it('should default to creating an empty mask', () => {
    const image = new IJS(2, 2);
    const output = imageToOutputMask(image);
    expect(output).toMatchObject({
      width: 2,
      height: 2,
      colorModel: ImageColorModel.BINARY,
      depth: ColorDepth.UINT1,
    });
    expect(output).toMatchMaskData([
      [0, 0],
      [0, 0],
    ]);
  });
  it('providing valid out', () => {
    const img = new IJS(1, 2);
    const out = new Mask(1, 2);
    const output = imageToOutputMask(img, { out });
    expect(output).toBe(out);
  });
  it('providing invalid out', () => {
    const img = new IJS(1, 2);
    const out = new Mask(2, 2);
    expect(() => {
      imageToOutputMask(img, { out });
    }).toThrow(/cannot use out. Its width property must be 1. Found 2/);
  });
  it('should throw if out is not a mask', () => {
    const img = new IJS(1, 2);
    // @ts-ignore
    expect(() => imageToOutputMask(img, { out: 'str' })).toThrow(
      /out must be a Mask object/,
    );
  });
});

describe('maskToOutputMask', () => {
  it('should default to creating an empty mask', () => {
    const mask = new Mask(2, 2);
    const output = maskToOutputMask(mask);
    expect(output).toMatchObject({
      width: 2,
      height: 2,
      colorModel: ImageColorModel.BINARY,
      depth: ColorDepth.UINT1,
    });
    expect(output).toMatchMaskData([
      [0, 0],
      [0, 0],
    ]);
  });
  it('providing valid out', () => {
    const mask = new Mask(1, 2);
    const out = new Mask(1, 2);
    const output = maskToOutputMask(mask, { out });
    expect(output).toBe(out);
  });
  it('providing invalid out', () => {
    const mask = new Mask(1, 2);
    const out = new Mask(2, 2);
    expect(() => {
      maskToOutputMask(mask, { out });
    }).toThrow(/cannot use out. Its width property must be 1. Found 2/);
  });
  it('should throw if out is not a mask', () => {
    const mask = new Mask(1, 2);
    // @ts-ignore
    expect(() => maskToOutputMask(mask, { out: 'str' })).toThrow(
      /out must be a Mask object/,
    );
  });
  it('should clone data to out', () => {
    const img = testUtils.createMask([
      [0, 1],
      [1, 0],
    ]);

    let out = testUtils.createMask([
      [1, 0],
      [0, 0],
    ]);
    const output = maskToOutputMask(img, { out }, { clone: true });
    expect(out).toBe(output);
    expect(out).toMatchMask(img);
  });
  it('should clone img to undefined out', () => {
    const img = testUtils.createMask([
      [0, 1],
      [1, 0],
    ]);

    const output = maskToOutputMask(img, {}, { clone: true });
    expect(output).toMatchMask(img);
  });
});
