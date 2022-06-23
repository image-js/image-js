import { setBlendedPixel } from '../setBlendedPixel';

describe('setBlendedPixel', () => {
  it('GREYA image, default options', () => {
    let image = testUtils.createGreyaImage([
      [50, 255],
      [20, 30],
    ]);
    setBlendedPixel(image, 0, 1);
    expect(image).toMatchImageData([
      [50, 255],
      [0, 255],
    ]);
  });
  it('GREYA images: transparent source, opaque target', () => {
    let image = testUtils.createGreyaImage([[50, 255]]);
    setBlendedPixel(image, 0, 0, { color: [100, 0] });
    expect(image).toMatchImageData([[50, 255]]);
  });
  it('GREYA images: opaque source, transparent target', () => {
    let image = testUtils.createGreyaImage([[50, 0]]);
    setBlendedPixel(image, 0, 0, { color: [100, 255] });
    expect(image).toMatchImageData([[100, 255]]);
  });
  it('GREYA image: alpha different from 255', () => {
    let image = testUtils.createGreyaImage([[50, 64]]);
    setBlendedPixel(image, 0, 0, { color: [100, 128] });
    const alpha = 128 + 64 * (1 - 128 / 255);
    const component = (100 * 128 + 50 * 64 * (1 - 128 / 255)) / alpha;
    expect(image).toMatchImageData([[component, alpha]]);
  });
  it('asymetrical test', () => {
    let image = testUtils.createGreyaImage([
      [50, 255, 1, 2, 3, 4],
      [20, 30, 5, 6, 7, 8],
      [1, 2, 3, 4, 5, 6],
    ]);
    setBlendedPixel(image, 2, 0, { color: [0, 125] });
    expect(image).toMatchImageData([
      [50, 255, 1, 2, 0, 127],
      [20, 30, 5, 6, 7, 8],
      [1, 2, 3, 4, 5, 6],
    ]);
  });
  it('2x2 mask, default options', () => {
    let mask = testUtils.createMask([
      [1, 0],
      [0, 0],
    ]);
    setBlendedPixel(mask, 1, 0);
    expect(mask).toMatchMask(mask);
  });
  it('2x2 mask, color is 1', () => {
    let mask = testUtils.createMask([
      [1, 0],
      [0, 0],
    ]);
    setBlendedPixel(mask, 1, 0, { color: [1] });

    expect(mask).toMatchMaskData([
      [1, 1],
      [0, 0],
    ]);
  });
});
