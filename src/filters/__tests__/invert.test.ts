import { Image } from '../../Image.js';
import { Mask } from '../../Mask.js';

describe('image is an Image', () => {
  it('invert an RGB image', () => {
    const img = testUtils.createRgbImage([[0, 50, 127, 255, 250, 4]]);
    const inverted = img.invert();
    expect(inverted).not.toBe(img);
    expect(inverted).toMatchImageData([[255, 205, 128, 0, 5, 251]]);
  });

  it('invert an RGBA image', () => {
    const img = testUtils.createRgbaImage([
      [0, 50, 127, 200, 255, 250, 4, 200],
    ]);
    const inverted = img.invert();
    expect(inverted).not.toBe(img);
    expect(inverted).toMatchImageData([[255, 205, 128, 200, 0, 5, 251, 200]]);
  });

  it('invert a grey image with alpha', () => {
    const image = testUtils.createGreyaImage([
      [0, 255],
      [255, 0],
    ]);
    const inverted = image.invert();
    expect(inverted).toMatchImageData([
      [255, 255],
      [0, 0],
    ]);
  });

  it('invert 16-bit GREY image', () => {
    const image = testUtils.createGreyImage([
      [1, 2],
      [3, 4],
    ]);

    const inverted = image.invert();
    expect(inverted).not.toBe(image);
    expect(inverted).toMatchImageData([
      [65534, 65533],
      [65532, 65531],
    ]);
  });

  it('invert with out parameter', () => {
    const image = testUtils.createRgbImage([
      [230, 83, 120],
      [100, 140, 13],
    ]);

    const out = new Image(1, 2);
    const inverted = image.invert({ out });
    expect(inverted).toMatchImageData([
      [25, 172, 135],
      [155, 115, 242],
    ]);
    expect(inverted).toBe(out);
  });

  it('invert with out parameter set to self', () => {
    const image = testUtils.createGreyaImage([
      [0, 255],
      [255, 0],
    ]);
    image.invert({ out: image });
    expect(image).toMatchImageData([
      [255, 255],
      [0, 0],
    ]);
  });
});

describe('image is a Mask', () => {
  it('invert a Mask', () => {
    const mask = testUtils.createMask([[0, 1, 1, 1, 0, 0]]);
    const inverted = mask.invert();
    expect(inverted).not.toBe(mask);
    expect(inverted).toMatchMaskData([[1, 0, 0, 0, 1, 1]]);
  });
  it('invert with out parameter', () => {
    const mask = testUtils.createMask([
      [1, 1, 1],
      [0, 0, 0],
    ]);

    const out = new Mask(3, 2);
    const inverted = mask.invert({ out });
    expect(inverted).toMatchMaskData([
      [0, 0, 0],
      [1, 1, 1],
    ]);
    expect(inverted).toBe(out);
  });

  it('invert with out parameter set to self', () => {
    const mask = testUtils.createMask([
      [0, 1],
      [1, 0],
    ]);
    mask.invert({ out: mask });
    expect(mask).toMatchMaskData([
      [1, 0],
      [0, 1],
    ]);
  });
});
