import { readImage } from 'test/readFile';
import { decodePng, ColorDepth, ImageKind } from 'ijs';

describe('Load PNG', function () {
  const tests: [string, ColorDepth, ImageKind][] = [
    // ['name', components, alpha, bitDepth]
    ['grey8', ColorDepth.UINT8, ImageKind.GREY],
    ['grey16', ColorDepth.UINT16, ImageKind.GREY],
    ['greya16', ColorDepth.UINT8, ImageKind.GREYA],
    ['greya32', ColorDepth.UINT16, ImageKind.GREYA],
    ['rgb24', ColorDepth.UINT8, ImageKind.RGB],
    ['rgb48', ColorDepth.UINT16, ImageKind.RGB],
    ['rgba32', ColorDepth.UINT8, ImageKind.RGBA],
    ['rgba64', ColorDepth.UINT16, ImageKind.RGBA],
    ['plt-4bpp', ColorDepth.UINT8, ImageKind.RGB],
    ['plt-8bpp-color', ColorDepth.UINT8, ImageKind.RGB]
  ];

  it.each(tests)('should load from buffer %s', async (name, depth, kind) => {
    const buffer = readImage(`${name}.png`);
    const img = decodePng(buffer);
    expect(img.depth).toBe(depth);
    expect(img.kind).toBe(kind);
  });
});
