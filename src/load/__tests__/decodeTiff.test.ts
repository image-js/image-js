import { decodeTiff } from '../decodeTiff';

const tests = [
  // ['name', components, alpha, bitDepth]
  ['grey8', 'GREY', 8],
  ['grey16', 'GREY', 16],
  // TODO: support 32 bits again.
  // ['grey32', 'GREY', 32],
  ['greya16', 'GREYA', 8],
  ['greya32', 'GREYA', 16],
  ['rgba8', 'RGBA', 8],
  ['rgb16', 'RGB', 16],
  ['palette', 'RGB', 16],
] as const;

test.each(tests)('%s', (name, colorModel, bitDepth) => {
  const buffer = testUtils.loadBuffer(`formats/tif/${name}.tif`);
  const img = decodeTiff(buffer);
  expect(img.colorModel).toBe(colorModel);
  expect(img.bitDepth).toBe(bitDepth);
});
