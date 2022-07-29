test('3x3 grey image, default options', () => {
  const image = testUtils.createGreyImage([
    [30, 23, 2],
    [45, 65, 1],
    [1, 2, 2],
  ]);
  const mask = testUtils.createMask([
    [0, 1],
    [1, 0],
  ]);
  const result = image.paintMask(mask);

  expect(result).toMatchImageData([
    [30, 0, 2],
    [0, 65, 1],
    [1, 2, 2],
  ]);
});

test('3x3 grey image, offset', () => {
  const image = testUtils.createGreyImage([
    [30, 23, 2],
    [45, 65, 1],
    [1, 2, 2],
  ]);
  const mask = testUtils.createMask([
    [0, 1],
    [1, 0],
  ]);
  const result = image.paintMask(mask, { origin: { column: 1, row: 0 } });

  expect(result).toMatchImageData([
    [30, 23, 0],
    [45, 0, 1],
    [1, 2, 2],
  ]);
});

test('3x3 grey image, negative offset', () => {
  const image = testUtils.createGreyImage([
    [30, 23, 2],
    [45, 65, 1],
    [1, 2, 2],
  ]);
  const mask = testUtils.createMask([
    [0, 1, 1],
    [1, 0, 1],
  ]);
  const result = image.paintMask(mask, { origin: { column: -1, row: 0 } });

  expect(result).toMatchImageData([
    [0, 0, 2],
    [45, 0, 1],
    [1, 2, 2],
  ]);
});

test('3x3 grey image, custom color', () => {
  const image = testUtils.createGreyImage([
    [30, 23, 2],
    [45, 65, 1],
    [1, 2, 2],
  ]);
  const mask = testUtils.createMask([
    [1, 1],
    [1, 0],
  ]);
  const result = image.paintMask(mask, { color: [100] });

  expect(result).toMatchImageData([
    [100, 100, 2],
    [100, 65, 1],
    [1, 2, 2],
  ]);
});

test('3x3 grey image, transparent source', () => {
  const image = testUtils.createRgbaImage([
    [30, 23, 2, 2],
    [45, 65, 1, 5],
    [1, 2, 2, 7],
  ]);
  const mask = testUtils.createMask([[1]]);
  const result = image.paintMask(mask, { color: [20, 30, 40, 0] });

  expect(result).toMatchImage(image);
});

test('custom color is incompatible with image', () => {
  const image = testUtils.createRgbaImage([
    [30, 23, 2, 2],
    [45, 65, 1, 5],
    [1, 2, 2, 7],
  ]);
  const mask = testUtils.createMask([[1]]);

  expect(() => {
    image.paintMask(mask, { color: [20] });
  }).toThrow('paintMask: the given color is not compatible with the image');
});

test('blend is true but color has null values', () => {
  const image = testUtils.createRgbaImage([
    [30, 23, 2, 2],
    [45, 65, 1, 5],
    [1, 2, 2, 7],
  ]);
  const mask = testUtils.createMask([[1]]);

  expect(() => {
    image.paintMask(mask, { color: [null, 0, 0, 255] });
  }).toThrow('paintMask: cannot have null channels in color if blend is true');
});

test('blend = false, all values null', () => {
  const image = testUtils.createRgbaImage([
    [30, 23, 2, 2],
    [45, 65, 1, 5],
    [1, 2, 2, 7],
  ]);
  const mask = testUtils.createMask([[1]]);
  const result = image.paintMask(mask, {
    blend: false,
    color: [null, null, null, null],
  });
  expect(result).toStrictEqual(image);
});

test('blend = false, change red and alpha', () => {
  const image = testUtils.createRgbaImage([
    [30, 23, 2, 2],
    [45, 65, 1, 5],
    [1, 2, 2, 7],
  ]);
  const mask = testUtils.createMask([[1]]);
  const result = image.paintMask(mask, {
    blend: false,
    color: [255, null, null, 255],
  });
  expect(result).toMatchImageData([
    [255, 23, 2, 255],
    [45, 65, 1, 5],
    [1, 2, 2, 7],
  ]);
});

test('blend = false, change many pixels', () => {
  const image = testUtils.createGreyaImage([
    [30, 23, 2, 2],
    [45, 65, 1, 5],
    [1, 2, 2, 7],
  ]);
  const mask = testUtils.createMask([
    [1, 1],
    [0, 1],
  ]);
  const result = image.paintMask(mask, {
    blend: false,
    color: [0, 100],
  });
  expect(result).toMatchImageData([
    [0, 100, 0, 100],
    [45, 65, 0, 100],
    [1, 2, 2, 7],
  ]);
});

test('out option', () => {
  const image = testUtils.createGreyImage([
    [30, 23, 2, 2],
    [45, 65, 1, 5],
    [1, 2, 2, 7],
  ]);
  const mask = testUtils.createMask([[1]]);
  image.paintMask(mask, {
    color: [255],
    out: image,
  });
  expect(image).toMatchImageData([
    [255, 23, 2, 2],
    [45, 65, 1, 5],
    [1, 2, 2, 7],
  ]);
});
