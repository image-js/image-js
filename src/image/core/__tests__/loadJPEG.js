import { Image, load, getImage } from 'test/common';
import { readFileSync } from 'fs';

describe('Load JPEG', function () {
  const tests = [
    // ['name', components, alpha, bitDepth]
    ['grey6', 3, 1, 8],
    ['grey12', 3, 1, 8],
    ['rgb6', 3, 1, 8],
    ['rgb12', 3, 1, 8]
  ];

  it.each(tests)('should load from path %s', async (name, components, alpha, bitDepth) => {
    const img = await load(`format/jpg/${name}.jpg`);
    expect(img.components).toBe(components);
    expect(img.alpha).toBe(alpha);
    expect(img.bitDepth).toBe(bitDepth);
  });

  it.each(tests)('should load from buffer %s', async (name, components, alpha, bitDepth) => {
    const data = readFileSync(getImage(`format/jpg/${name}.jpg`));
    const img = await Image.load(data);
    expect(img.components).toBe(components);
    expect(img.alpha).toBe(alpha);
    expect(img.bitDepth).toBe(bitDepth);
  });
});
