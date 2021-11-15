import { IJS } from '../../IJS';

test('invert an RGB image', () => {
  const img = testUtils.createRgbImage([[0, 50, 127, 255, 250, 4]]);
  const inverted = img.invert();
  expect(inverted).not.toBe(img);
  expect(inverted).toMatchImageData([[255, 205, 128, 0, 5, 251]]);
});

test('invert an RGBA image', () => {
  const img = testUtils.createRgbaImage([[0, 50, 127, 200, 255, 250, 4, 200]]);
  const inverted = img.invert();
  expect(inverted).not.toBe(img);
  expect(inverted).toMatchImageData([[255, 205, 128, 200, 0, 5, 251, 200]]);
});

test('invert a grey image with alpha', () => {
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

test('invert 16-bit GREY image', () => {
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

test('invert with out parameter', () => {
  const image = testUtils.createRgbImage([
    [230, 83, 120],
    [100, 140, 13],
  ]);

  const out = new IJS(1, 2);
  const inverted = image.invert({ out });
  expect(inverted).toMatchImageData([
    [25, 172, 135],
    [155, 115, 242],
  ]);
  expect(inverted).toBe(out);
});

test('invert with out parameter set to self', () => {
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
