import { ImageColorModel } from '../../utils/colorModels';
import { copyAlpha } from '../convertColor';

describe('convertColor', () => {
  it('GREY to GREYA', () => {
    const image = testUtils.createGreyImage([
      [10, 30],
      [50, 70],
    ]);

    const converted = image.convertColor(ImageColorModel.GREYA);
    expect(converted).toMatchImageData([
      [10, 255, 30, 255],
      [50, 255, 70, 255],
    ]);
  });

  it('GREYA to GREY', () => {
    const image = testUtils.createGreyaImage([
      [10, 100, 30, 100],
      [50, 100, 70, 100],
    ]);

    const converted = image.convertColor(ImageColorModel.GREY);
    expect(converted).toMatchImageData([
      [10, 30],
      [50, 70],
    ]);
  });

  it('GREY to RGB', () => {
    const image = testUtils.createGreyImage([
      [10, 30],
      [50, 70],
    ]);

    const converted = image.convertColor(ImageColorModel.RGB);
    expect(converted).toMatchImageData([
      [10, 10, 10, 30, 30, 30],
      [50, 50, 50, 70, 70, 70],
    ]);
  });

  it('GREYA to RGB', () => {
    const image = testUtils.createGreyaImage([
      [10, 100, 30, 100],
      [50, 100, 70, 100],
    ]);

    const converted = image.convertColor(ImageColorModel.RGB);
    expect(converted).toMatchImageData([
      [10, 10, 10, 30, 30, 30],
      [50, 50, 50, 70, 70, 70],
    ]);
  });

  it('GREY to RGBA', () => {
    const image = testUtils.createGreyImage([
      [10, 30],
      [50, 70],
    ]);

    const converted = image.convertColor(ImageColorModel.RGBA);
    expect(converted).toMatchImageData([
      [10, 10, 10, 255, 30, 30, 30, 255],
      [50, 50, 50, 255, 70, 70, 70, 255],
    ]);
  });

  it('GREYA to RGBA', () => {
    const image = testUtils.createGreyaImage([
      [10, 100, 30, 100],
      [50, 100, 70, 100],
    ]);

    const converted = image.convertColor(ImageColorModel.RGBA);
    expect(converted).toMatchImageData([
      [10, 10, 10, 100, 30, 30, 30, 100],
      [50, 50, 50, 100, 70, 70, 70, 100],
    ]);
  });

  it('RGB to RGBA', () => {
    const image = testUtils.createRgbImage([[10, 20, 30, 40, 60, 70]]);

    const converted = image.convertColor(ImageColorModel.RGBA);
    expect(converted).toMatchImageData([[10, 20, 30, 255, 40, 60, 70, 255]]);
  });

  it('RGBA to RGB', () => {
    const image = testUtils.createRgbaImage([
      [10, 20, 30, 100, 40, 60, 70, 100],
    ]);

    const converted = image.convertColor(ImageColorModel.RGB);
    expect(converted).toMatchImageData([[10, 20, 30, 40, 60, 70]]);
  });

  it('Mask to GREY', () => {
    const mask = testUtils.createMask([
      [1, 1],
      [0, 0],
    ]);

    let img = mask.convertColor(ImageColorModel.GREY);
    expect(img).toMatchImageData([
      [255, 255],
      [0, 0],
    ]);
  });

  it('Cannot convert to same colorModel', () => {
    const image = testUtils.createRgbImage([[10, 20, 30, 40, 60, 70]]);

    expect(() => image.convertColor(ImageColorModel.RGB)).toThrow(
      /Cannot convert color, image is already RGB/,
    );
  });

  it('conversion not implemented', () => {
    const image = testUtils.createMask([[0, 1, 0, 1, 0, 1]]);

    expect(() => image.convertColor(ImageColorModel.RGB)).toThrow(
      /conversion from BINARY to RGB not implemented/,
    );
  });

  it('GREY to RGBA 16-bit', () => {
    const image = testUtils.createGreyImage([[256, 512, 768, 1024]]);

    const converted = image.convertColor(ImageColorModel.RGBA);
    expect(converted).toMatchImageData([
      [
        256, 256, 256, 65535, 512, 512, 512, 65535, 768, 768, 768, 65535, 1024,
        1024, 1024, 65535,
      ],
    ]);
  });

  it('image to GREY', () => {
    const testImage = testUtils.load('opencv/test.png');
    const grey = testImage.convertColor(ImageColorModel.GREY);
    const expected = testUtils.createGreyImage([
      [255, 255, 255, 255, 255, 255, 255, 255],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 76, 76, 255, 255, 179, 179, 0],
      [0, 76, 76, 255, 255, 179, 179, 0],
      [0, 150, 150, 0, 0, 105, 105, 0],
      [0, 150, 150, 0, 0, 105, 105, 0],
      [0, 29, 29, 128, 128, 226, 226, 0],
      [0, 29, 29, 128, 128, 226, 226, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [255, 255, 255, 255, 255, 255, 255, 255],
    ]);
    expect(grey).toMatchImage(expected);
  });
});
describe('copyAlpha', () => {
  it('source and dest different sizes', () => {
    const source = testUtils.createRgbaImage([
      [10, 20, 30, 40, 60, 70, 80, 90],
    ]);
    const dest = testUtils.createRgbaImage([[10, 20, 30, 40]]);

    expect(() => copyAlpha(source, dest)).toThrow(
      /source and destination have different sizes/,
    );
  });
  it('source has no alpha', () => {
    const source = testUtils.createRgbImage([[10, 20, 30]]);
    const dest = testUtils.createRgbaImage([[10, 20, 30, 40]]);

    expect(() => copyAlpha(source, dest)).toThrow(
      /source image does not have alpha/,
    );
  });
  it('dest has no alpha', () => {
    const dest = testUtils.createRgbImage([[10, 20, 30]]);
    const source = testUtils.createRgbaImage([[10, 20, 30, 40]]);

    expect(() => copyAlpha(source, dest)).toThrow(
      /destination does not have alpha/,
    );
  });
});
