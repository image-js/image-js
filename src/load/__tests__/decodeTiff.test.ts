import { ColorDepth, ImageColorModel } from '../..';
import { decodeTiff } from '../decodeTiff';

describe('Load TIFF', () => {
  const tests = [
    // ['name', components, alpha, bitDepth]
    ['grey8', ImageColorModel.GREY, ColorDepth.UINT8],
    ['grey16', ImageColorModel.GREY, ColorDepth.UINT16],
    // ['grey32', ImageColorModel.GREY, ColorDepth.UINT32],
    ['greya16', ImageColorModel.GREYA, ColorDepth.UINT8],
    ['greya32', ImageColorModel.GREYA, ColorDepth.UINT16],
    ['rgba8', ImageColorModel.RGBA, ColorDepth.UINT8],
    ['rgb16', ImageColorModel.RGB, ColorDepth.UINT16],
    ['palette', ImageColorModel.RGB, ColorDepth.UINT16],
  ] as const;

  it.each(tests)('%s', async (name, colorModel, depth) => {
    const buffer = testUtils.loadBuffer(`formats/tif/${name}.tif`);
    const img = decodeTiff(buffer);

    expect(img.colorModel).toBe(colorModel);
    expect(img.depth).toBe(depth);
  });
});
