import { Image, load, getImage } from 'test/common';
import * as fs from 'fs';

describe('Load PNG', function () {
  const tests = [
    // ['name', components, alpha, bitDepth]
    ['grey8', 1, 0, 8],
    ['grey16', 1, 0, 16],
    ['greya16', 1, 1, 8],
    ['greya32', 1, 1, 16],
    ['rgb24', 3, 0, 8],
    ['rgb48', 3, 0, 16],
    ['rgba32', 3, 1, 8],
    ['rgba64', 3, 1, 16],
    ['plt-4bpp', 3, 0, 8],
    ['plt-8bpp-color', 3, 0, 8]
  ];

  it.each(tests)('should load from path %s', async (name, components, alpha, bitDepth) => {
    const img = await load(`format/png/${name}.png`);
    expect(img.components).toBe(components);
    expect(img.alpha).toBe(alpha);
    expect(img.bitDepth).toBe(bitDepth);
  });

  it.each(tests)('should load from buffer %s', async (name, components, alpha, bitDepth) => {
    const data = fs.readFileSync(getImage(`format/png/${name}.png`));
    const img = await Image.load(data);
    expect(img.components).toBe(components);
    expect(img.alpha).toBe(alpha);
    expect(img.bitDepth).toBe(bitDepth);
  });
});
