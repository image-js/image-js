test('RGBA image', () => {
  const image = testUtils.createRgbaImage([
    [100, 150, 200, 255, 100, 150, 200, 0],
  ]);

  expect(
    image.grey({
      algorithm: (red: number, green: number, blue: number) =>
        Math.min(red, green, blue),
    }),
  ).toMatchImageData([[100, 0]]);

  expect(image.grey()).toMatchImageData([[142, 0]]);
  expect(image.grey({ algorithm: 'min' })).toMatchImageData([[100, 0]]);
  expect(image.grey({ algorithm: 'max' })).toMatchImageData([[200, 0]]);
  expect(image.grey({ algorithm: 'lightness' })).toMatchImageData([[150, 0]]);
  expect(image.grey({ algorithm: 'red' })).toMatchImageData([[100, 0]]);
  expect(image.grey({ algorithm: 'green' })).toMatchImageData([[150, 0]]);
  expect(image.grey({ algorithm: 'blue' })).toMatchImageData([[200, 0]]);
  expect(image.grey({ algorithm: 'magenta' })).toMatchImageData([[63, 0]]);
  expect(image.grey({ algorithm: 'cyan' })).toMatchImageData([[127, 0]]);
  expect(image.grey({ algorithm: 'yellow' })).toMatchImageData([[0, 0]]);
  expect(image.grey({ algorithm: 'black' })).toMatchImageData([[55, 0]]);
  expect(image.grey({ algorithm: 'hue' })).toMatchImageData([[148, 0]]);
  expect(image.grey({ algorithm: 'saturation' })).toMatchImageData([[127, 0]]);

  expect(image.grey({ keepAlpha: true })).toMatchImageData([
    [142, 255, 142, 0],
  ]);

  expect(image.grey({ mergeAlpha: true })).toMatchImageData([[142, 0]]);

  expect(
    image.grey({ algorithm: 'average', keepAlpha: true }),
  ).toMatchImageData([[150, 255, 150, 0]]);

  expect(image.grey({ algorithm: 'max', keepAlpha: true })).toMatchImageData([
    [200, 255, 200, 0],
  ]);

  expect(image.grey({ algorithm: 'minmax', keepAlpha: true })).toMatchImageData(
    [[150, 255, 150, 0]],
  );

  expect(
    image.grey({ algorithm: 'luma601', keepAlpha: true }),
  ).toMatchImageData([[140, 255, 140, 0]]);

  expect(
    image.grey({ algorithm: 'luma709', keepAlpha: true }),
  ).toMatchImageData([[142, 255, 142, 0]]);
});

test('RGB image', () => {
  const image = testUtils.createRgbImage([[100, 150, 200, 100, 150, 200]]);

  expect(
    image.grey({
      algorithm: (red: number, green: number, blue: number) =>
        Math.min(red, green, blue),
    }),
  ).toMatchImageData([[100, 100]]);

  expect(image.grey()).toMatchImageData([[142, 142]]);
  expect(image.grey({ algorithm: 'min' })).toMatchImageData([[100, 100]]);
  expect(image.grey({ algorithm: 'max' })).toMatchImageData([[200, 200]]);
  expect(image.grey({ algorithm: 'lightness' })).toMatchImageData([[150, 150]]);
  expect(image.grey({ algorithm: 'red' })).toMatchImageData([[100, 100]]);
  expect(image.grey({ algorithm: 'green' })).toMatchImageData([[150, 150]]);
  expect(image.grey({ algorithm: 'blue' })).toMatchImageData([[200, 200]]);
  expect(image.grey({ algorithm: 'magenta' })).toMatchImageData([[63, 63]]);
});

test('wrong image color model', () => {
  let image = testUtils.createGreyaImage([[100, 255, 150, 0]]);
  expect(() => image.grey()).toThrow(
    /image colorModel must be RGB or RGBA to apply this algorithm/,
  );
  image = testUtils.createGreyImage([[100, 255, 150, 0]]);
  expect(() => image.grey()).toThrow(
    /image colorModel must be RGB or RGBA to apply this algorithm/,
  );
});

test('user-provided output', () => {
  const image = testUtils.createRgbaImage([
    [100, 150, 200, 255, 100, 150, 200, 0],
  ]);

  const out = testUtils.createGreyImage([[0, 0]]);
  const result = image.grey({ out });
  expect(result).toBe(out);
  expect(out).toMatchImageData([[142, 0]]);

  const wrongOut = testUtils.createGreyaImage([[0, 0, 0, 0]]);
  expect(() => image.grey({ out: wrongOut })).toThrow(
    /cannot use out image. Its colorModel property must be GREY. Received GREYA/,
  );
});

test('wrong algorithm type', () => {
  const image = testUtils.createRgbaImage([
    [100, 150, 200, 255, 100, 150, 200, 0],
  ]);

  const out = testUtils.createGreyImage([[0, 0]]);
  const result = image.grey({ out });
  expect(result).toBe(out);
  expect(out).toMatchImageData([[142, 0]]);

  const wrongOut = testUtils.createGreyaImage([[0, 0, 0, 0]]);
  expect(() => image.grey({ out: wrongOut })).toThrow(
    /cannot use out image. Its colorModel property must be GREY. Received GREYA/,
  );
});
