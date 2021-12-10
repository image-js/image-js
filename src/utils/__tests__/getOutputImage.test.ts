import { Mask } from '../..';
import { IJS, ColorDepth } from '../../IJS';
import { ImageColorModel } from '../colorModels';
import { getOutputImage, maskToOutputImage } from '../getOutputImage';

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

  it('should clone data', () => {
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
  // TODO: enhance this test
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
});
