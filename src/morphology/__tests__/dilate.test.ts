test('another GREY image 5x5, default kernel', () => {
  const image = testUtils.createGreyImage([
    [255, 0, 0, 0, 255],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [255, 0, 0, 0, 255],
  ]);

  expect(image.dilate()).toMatchImageData([
    [255, 255, 0, 255, 255],
    [255, 255, 0, 255, 255],
    [0, 0, 0, 0, 0],
    [255, 255, 0, 255, 255],
    [255, 255, 0, 255, 255],
  ]);
});

test('GREY image 5x5, 3x3 kernel onlyOnes', () => {
  const kernel = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];
  const image = testUtils.createGreyImage([
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
  ]);

  expect(image.dilate({ kernel })).toMatchImageData([
    [255, 255, 0, 255, 255],
    [255, 255, 0, 255, 255],
    [255, 255, 0, 255, 255],
    [255, 255, 0, 255, 255],
    [255, 255, 0, 255, 255],
  ]);
});

test('another GREY image 5x5, default kernel, 2 iterations', () => {
  const image = testUtils.createGreyImage([
    [255, 0, 0, 0, 255],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  expect(image.dilate({ iterations: 2 })).toMatchImageData([
    [255, 255, 255, 255, 255],
    [255, 255, 255, 255, 255],
    [255, 255, 255, 255, 255],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test('GREY image 5x5, 3x1 kernel onlyOnes', () => {
  const kernel = [[1], [1], [1]];
  const image = testUtils.createGreyImage([
    [255, 0, 0, 0, 255],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [255, 0, 0, 0, 255],
  ]);

  expect(image.dilate({ kernel })).toMatchImageData([
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [0, 0, 0, 0, 0],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
  ]);
});

test('GREY image 5x5, 3x1 kernel with zero', () => {
  const kernel = [[1], [1], [0]];
  const image = testUtils.createGreyImage([
    [255, 0, 0, 0, 255],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [255, 0, 0, 0, 255],
  ]);

  expect(image.dilate({ kernel })).toMatchImageData([
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [255, 0, 0, 0, 255],
  ]);
});

test('mask 5x5, default kernel', () => {
  const mask = testUtils.createMask(`
      1 0 0 0 1
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      1 0 0 0 1
    `);

  const expected = testUtils.createMask(`
      1 1 0 1 1
      1 1 0 1 1
      0 0 0 0 0
      1 1 0 1 1
      1 1 0 1 1
    `);

  expect(mask.dilate()).toMatchMask(expected);
});

test('mask 5x5, 1x3 kernel onlyOnes', () => {
  const kernel = [[1, 1, 1]];

  const mask = testUtils.createMask(`
      1 0 0 0 1
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      1 0 0 0 1
    `);

  const expected = testUtils.createMask(`
      1 1 0 1 1
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      1 1 0 1 1
    `);

  expect(mask.dilate({ kernel })).toMatchMask(expected);
});

test('mask 5x5, 1x3 kernel with zero', () => {
  const kernel = [[1, 0, 1]];

  const mask = testUtils.createMask(`
      1 0 0 0 1
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      1 0 0 0 1
    `);

  const expected = testUtils.createMask(`
      0 1 0 1 0
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      0 1 0 1 0
    `);

  expect(mask.dilate({ kernel })).toMatchMask(expected);
});
