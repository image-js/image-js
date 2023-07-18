test('GREY to GREYA', () => {
  const image = testUtils.createGreyImage([
    [10, 30],
    [50, 70],
  ]);

  const converted = image.convertColor('GREYA');
  expect(converted).toMatchImageData([
    [10, 255, 30, 255],
    [50, 255, 70, 255],
  ]);
});

test('GREYA to GREY', () => {
  const image = testUtils.createGreyaImage([
    [10, 100, 30, 100],
    [50, 100, 70, 100],
  ]);

  const converted = image.convertColor('GREY');
  expect(converted).toMatchImageData([
    [10, 30],
    [50, 70],
  ]);
});

test('GREY to RGB', () => {
  const image = testUtils.createGreyImage([
    [10, 30],
    [50, 70],
  ]);

  const converted = image.convertColor('RGB');
  expect(converted).toMatchImageData([
    [10, 10, 10, 30, 30, 30],
    [50, 50, 50, 70, 70, 70],
  ]);
});

test('GREYA to RGB', () => {
  const image = testUtils.createGreyaImage([
    [10, 100, 30, 100],
    [50, 100, 70, 100],
  ]);

  const converted = image.convertColor('RGB');
  expect(converted).toMatchImageData([
    [10, 10, 10, 30, 30, 30],
    [50, 50, 50, 70, 70, 70],
  ]);
});

test('GREY to RGBA', () => {
  const image = testUtils.createGreyImage([
    [10, 30],
    [50, 70],
  ]);

  const converted = image.convertColor('RGBA');
  expect(converted).toMatchImageData([
    [10, 10, 10, 255, 30, 30, 30, 255],
    [50, 50, 50, 255, 70, 70, 70, 255],
  ]);
});

test('GREYA to RGBA', () => {
  const image = testUtils.createGreyaImage([
    [10, 100, 30, 100],
    [50, 100, 70, 100],
  ]);

  const converted = image.convertColor('RGBA');
  expect(converted).toMatchImageData([
    [10, 10, 10, 100, 30, 30, 30, 100],
    [50, 50, 50, 100, 70, 70, 70, 100],
  ]);
});

test('RGB to RGBA', () => {
  const image = testUtils.createRgbImage([[10, 20, 30, 40, 60, 70]]);

  const converted = image.convertColor('RGBA');
  expect(converted).toMatchImageData([[10, 20, 30, 255, 40, 60, 70, 255]]);
});

test('RGBA to RGB', () => {
  const image = testUtils.createRgbaImage([[10, 20, 30, 100, 40, 60, 70, 100]]);

  const converted = image.convertColor('RGB');
  expect(converted).toMatchImageData([[10, 20, 30, 40, 60, 70]]);
});

test('Mask to GREY', () => {
  const mask = testUtils.createMask([
    [1, 1],
    [0, 0],
  ]);

  const img = mask.convertColor('GREY');
  expect(img).toMatchImageData([
    [255, 255],
    [0, 0],
  ]);
});

test('Mask to RGBA', () => {
  const mask = testUtils.createMask(`
    0 0
    1 0
    0 1
  `);

  const img = mask.convertColor('RGBA');
  expect(img).toMatchImageData([
    [0, 0, 0, 255, 0, 0, 0, 255],
    [255, 255, 255, 255, 0, 0, 0, 255],
    [0, 0, 0, 255, 255, 255, 255, 255],
  ]);
});

test('Mask to RGB', () => {
  const mask = testUtils.createMask(`
    0 0
    1 0
    0 1
  `);

  const img = mask.convertColor('RGB');
  expect(img).toMatchImageData([
    [0, 0, 0, 0, 0, 0],
    [255, 255, 255, 0, 0, 0],
    [0, 0, 0, 255, 255, 255],
  ]);
});

test('conversion not implemented', () => {
  const image = testUtils.createGreyImage([[0, 255, 0, 255, 0, 255]]);

  expect(() => image.convertColor('BINARY')).toThrow(
    /conversion from GREY to BINARY not implemented/,
  );
});

test('cannot convert to same colorModel', () => {
  const image = testUtils.createRgbImage([[10, 20, 30, 40, 60, 70]]);

  expect(() => image.convertColor('RGB')).toThrow(
    /cannot convert color, image is already RGB/,
  );
});

test('GREY to RGBA 16-bit', () => {
  const image = testUtils.createGreyImage([[256, 512, 768, 1024]]);

  const converted = image.convertColor('RGBA');
  expect(converted).toMatchImageData([
    [
      256, 256, 256, 65535, 512, 512, 512, 65535, 768, 768, 768, 65535, 1024,
      1024, 1024, 65535,
    ],
  ]);
});

test('image to GREY', () => {
  const testImage = testUtils.load('opencv/test.png');
  const grey = testImage.convertColor('GREY');
  const expected = testUtils.createGreyImage([
    [255, 255, 255, 255, 255, 255, 255, 255],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 76, 76, 255, 255, 179, 179, 0],
    [0, 76, 76, 255, 255, 179, 179, 0],
    [0, 150, 150, 0, 0, 105, 105, 0],
    [0, 150, 150, 0, 0, 105, 105, 0],
    [0, 29, 29, 128, 128, 226, 226, 0],
    [0, 29, 29, 128, 128, 226, 226, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [255, 255, 255, 255, 255, 255, 255, 255],
  ]);
  expect(grey).toMatchImage(expected);
});
