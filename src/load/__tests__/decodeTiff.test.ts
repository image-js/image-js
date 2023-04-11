import { ImageColorModel } from '../..';
import { decodeTiff } from '../decodeTiff';

const tests = [
  // ['name', components, alpha, bitDepth]
  ['grey8', ImageColorModel.GREY, 8],
  ['grey16', ImageColorModel.GREY, 16],
  // TODO: support 32 bits again.
  // ['grey32', ImageColorModel.GREY, 32],
  ['greya16', ImageColorModel.GREYA, 8],
  ['greya32', ImageColorModel.GREYA, 16],
  ['rgba8', ImageColorModel.RGBA, 8],
  ['rgb16', ImageColorModel.RGB, 16],
  ['palette', ImageColorModel.RGB, 16],
] as const;

test.each(tests)('%s', async (name, colorModel, depth) => {
  const buffer = testUtils.loadBuffer(`formats/tif/${name}.tif`);
  const img = decodeTiff(buffer);

  expect(img.colorModel).toBe(colorModel);
  expect(img.depth).toBe(depth);
});
