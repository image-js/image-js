import { readImage } from 'test/readFile';
import { decodeJpeg, ColorDepth, ImageKind } from 'ijs';

describe('Load JPEG', function () {
  const tests = [['grey6'], ['grey12'], ['rgb6'], ['rgb12']];

  it.each(tests)('should load from buffer %s', async (name) => {
    const buffer = readImage(`${name}.jpg`);
    const img = await decodeJpeg(buffer);
    expect(img.kind).toBe(ImageKind.RGBA);
    expect(img.depth).toBe(ColorDepth.UINT8);
  });
});
