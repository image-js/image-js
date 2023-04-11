import { decodePng } from '..';
import { ImageColorModel } from '../../utils/constants/colorModels';

const tests = [
  // ['name', components, alpha, bitDepth]
  ['grey8', 8, ImageColorModel.GREY],
  ['grey16', 16, ImageColorModel.GREY],
  ['greya16', 8, ImageColorModel.GREYA],
  ['greya32', 16, ImageColorModel.GREYA],
  ['rgb24', 8, ImageColorModel.RGB],
  ['rgb48', 16, ImageColorModel.RGB],
  ['rgba32', 8, ImageColorModel.RGBA],
  ['rgba64', 16, ImageColorModel.RGBA],
  ['plt-4bpp', 8, ImageColorModel.RGB],
  ['plt-8bpp-color', 8, ImageColorModel.RGB],
] as const;

test.each(tests)(
  'should load from buffer %s',
  async (name, depth, colorModel) => {
    const buffer = testUtils.loadBuffer(`formats/${name}.png`);
    const img = decodePng(buffer);
    expect(img.depth).toBe(depth);
    expect(img.colorModel).toBe(colorModel);
  },
);
