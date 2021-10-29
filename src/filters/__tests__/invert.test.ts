import { IJS, ImageColorModel } from '../../IJS';

test('invert an RGB image', () => {
  const img = new IJS(1, 2, {
    data: Uint8Array.from([0, 50, 127, 255, 250, 4]),
  });
  const inverted = img.invert();
  expect(inverted).not.toBe(img);
  expect(inverted).toMatchImageData([
    [255, 205, 128],
    [0, 5, 251],
  ]);
});

test('invert a grey image with alpha', () => {
  const img = new IJS(1, 2, {
    colorModel: ImageColorModel.GREYA,
    data: Uint8Array.from([0, 255, 255, 0]),
  });
  const inverted = img.invert();
  expect(inverted).toMatchImageData([
    [255, 0],
    [0, 255],
  ]);
});

test('invert 16-bit GREY image', () => {
  const image = new IJS(2, 2, {
    colorModel: ImageColorModel.GREY,
    depth: 16,
    data: Uint16Array.from([1, 2, 3, 4]),
  });

  const inverted = image.invert();
  expect(inverted).not.toBe(image);
  expect(inverted).toMatchImageData([
    [65534, 65533],
    [65532, 65531],
  ]);
});

test('invert with out parameter', () => {
  const image = new IJS(1, 2, {
    data: Uint8Array.from([230, 83, 120, 100, 140, 13]),
  });

  const out = new IJS(1, 2);
  const inverted = image.invert({ out });
  expect(inverted).toMatchImageData([
    [25, 172, 135],
    [155, 115, 242],
  ]);
  expect(inverted).toBe(out);
});

test('invert with out parameter set to self', () => {
  const img = new IJS(1, 2, {
    colorModel: ImageColorModel.GREYA,
    data: Uint8Array.from([0, 255, 255, 0]),
  });
  img.invert({ out: img });
  expect(img).toMatchImageData([
    [255, 0],
    [0, 255],
  ]);
});
