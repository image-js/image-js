import { decodePng } from '..';
import { ColorDepth } from '../../IJS';
import { ImageColorModel } from '../../utils/colorModels';

describe('Load PNG', () => {
  const tests = [
    // ['name', components, alpha, bitDepth]
    ['grey8', ColorDepth.UINT8, ImageColorModel.GREY],
    ['grey16', ColorDepth.UINT16, ImageColorModel.GREY],
    ['greya16', ColorDepth.UINT8, ImageColorModel.GREYA],
    ['greya32', ColorDepth.UINT16, ImageColorModel.GREYA],
    ['rgb24', ColorDepth.UINT8, ImageColorModel.RGB],
    ['rgb48', ColorDepth.UINT16, ImageColorModel.RGB],
    ['rgba32', ColorDepth.UINT8, ImageColorModel.RGBA],
    ['rgba64', ColorDepth.UINT16, ImageColorModel.RGBA],
    ['plt-4bpp', ColorDepth.UINT8, ImageColorModel.RGB],
    ['plt-8bpp-color', ColorDepth.UINT8, ImageColorModel.RGB],
  ] as const;

  it.each(tests)(
    'should load from buffer %s',
    async (name, depth, colorModel) => {
      const buffer = testUtils.loadBuffer(`formats/${name}.png`);
      const img = decodePng(buffer);
      expect(img.depth).toBe(depth);
      expect(img.colorModel).toBe(colorModel);
    },
  );
});
