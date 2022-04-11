import { load } from 'test/common';

describe('Load TIFF', () => {
  const tests = [
    // ['name', components, alpha, bitDepth, options]
    ['grey8', 1, 0, 8, undefined],
    ['grey16', 1, 0, 16, undefined],
    ['palette', 3, 0, 16, undefined],
    ['palette', 1, 0, 8, { ignorePalette: true }],
    ['grey32', 1, 0, 32, undefined],
  ];

  it.each(tests)('%s', async (name, components, alpha, bitDepth, options) => {
    const img = await load(`format/tif/${name}.tif`, options);
    expect(img.components).toBe(components);
    expect(img.alpha).toBe(alpha);
    expect(img.bitDepth).toBe(bitDepth);
    expect(img.meta).toMatchObject({
      tiff: expect.any(Object),
      exif: expect.any(Object),
    });
  });
});
