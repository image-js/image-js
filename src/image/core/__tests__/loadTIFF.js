import { load } from 'test/common';

describe('Load TIFF', function () {
  const tests = [
    // ['name', components, alpha, bitDepth]
    ['grey8', 1, 0, 8],
    ['grey16', 1, 0, 16]
  ];

  it.each(tests)('%s', async (name, components, alpha, bitDepth) => {
    const img = await load(`format/tif/${name}.tif`);
    expect(img.components).toBe(components);
    expect(img.alpha).toBe(alpha);
    expect(img.bitDepth).toBe(bitDepth);
    expect(img.meta).toMatchObject({
      tiff: expect.any(Object),
      exif: expect.any(Object)
    });
  });
});
