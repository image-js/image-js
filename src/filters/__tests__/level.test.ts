test('1x1 rgba image, default options', () => {
  const image = testUtils.createRgbaImage([[100, 0, 0, 50]]);
  expect(image.level()).toMatchImage(image);
});

test('1x1 rgba image, out to itself', () => {
  const image = testUtils.createRgbaImage([[100, 0, 0, 50]]);
  expect(image.level({ out: image })).toBe(image);
});

test('1x1 greya image, default options', () => {
  const image = testUtils.createRgbaImage([[100, 50, 0, 50]]);
  expect(image.level()).toMatchImage(image);
});

test('3x1 rgba image, custom input min and max', () => {
  const image = testUtils.createRgbaImage([
    [100, 0, 0, 50],
    [125, 0, 0, 50],
    [150, 0, 0, 50],
  ]);
  expect(image.level({ inputMin: 100, inputMax: 150 })).toMatchImageData([
    [0, 0, 0, 50],
    [127, 0, 0, 50],
    [255, 0, 0, 50],
  ]);
});

test('3x1 rgba image, custom output min and max', () => {
  const image = testUtils.createRgbaImage([
    [0, 0, 0, 50],
    [127, 0, 0, 50],
    [255, 0, 0, 50],
  ]);
  expect(image.level({ outputMin: 100, outputMax: 150 })).toMatchImageData([
    [100, 100, 100, 50],
    [124, 100, 100, 50],
    [150, 100, 100, 50],
  ]);
});

test('1x1 grey image, custom output and input values', () => {
  const image = testUtils.createGreyImage([[255]]);
  expect(
    image.level({
      inputMin: 50,
      inputMax: 150,
      outputMin: 100,
      outputMax: 140,
    }),
  ).toMatchImageData([[140]]);
});

test('3x1 rgba image, custom output and input values', () => {
  const image = testUtils.createRgbaImage([
    [0, 10, 20, 50],
    [30, 40, 50, 50],
    [60, 70, 80, 50],
  ]);
  expect(
    image.level({
      inputMin: 10,
      inputMax: 60,
      outputMin: 0,
      outputMax: 100,
    }),
  ).toMatchImageData([
    [0, 0, 20, 50],
    [40, 60, 80, 50],
    [100, 100, 100, 50],
  ]);
});

test('3x1 rgba image, custom channels', () => {
  const image = testUtils.createRgbaImage([
    [0, 10, 20, 50],
    [30, 40, 50, 50],
    [60, 70, 80, 50],
  ]);

  const result = image.level({
    inputMin: 10,
    inputMax: 60,
    outputMin: 0,
    outputMax: 100,
    channels: [1],
  });
  expect(result).toMatchImageData([
    [0, 0, 20, 50],
    [30, 60, 50, 50],
    [60, 100, 80, 50],
  ]);
});

test('3x1 rgba image, other custom channels', () => {
  const image = testUtils.createRgbaImage([
    [0, 10, 20, 50],
    [30, 40, 50, 50],
    [60, 70, 80, 50],
  ]);

  const result = image.level({
    inputMin: 10,
    inputMax: 60,
    outputMin: 0,
    outputMax: 100,
    channels: [0, 3],
  });
  expect(result).toMatchImageData([
    [0, 10, 20, 80],
    [40, 40, 50, 80],
    [100, 70, 80, 80],
  ]);
});

test('3x1 rgba image, modify alpha', () => {
  const image = testUtils.createRgbaImage([
    [0, 10, 20, 50],
    [30, 40, 50, 50],
    [60, 70, 80, 50],
  ]);
  expect(
    image.level({
      inputMin: 10,
      inputMax: 60,
      outputMin: 0,
      outputMax: 100,
      channels: [0, 1, 2, 3],
    }),
  ).toMatchImageData([
    [0, 0, 20, 80],
    [40, 60, 80, 80],
    [100, 100, 100, 80],
  ]);
});

test('3x1 rgba image, arrays as input', () => {
  const image = testUtils.createRgbaImage([
    [0, 10, 20, 50],
    [30, 40, 50, 50],
    [60, 70, 80, 50],
  ]);

  const result = image.level({
    inputMin: [0, 0, 0, 0],
    inputMax: [50, 50, 100, 100],
    outputMin: 0,
    outputMax: 100,
  });

  expect(result).toMatchImageData([
    [0, 20, 20, 50],
    [60, 80, 50, 50],
    [100, 100, 80, 50],
  ]);
});
