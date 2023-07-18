test('GREY image 5x5', () => {
  const image = testUtils.createGreyImage([
    [255, 0, 255, 255, 255],
    [255, 0, 255, 255, 255],
    [255, 0, 255, 255, 255],
    [255, 0, 255, 255, 255],
    [255, 0, 255, 255, 255],
  ]);

  expect(image.erode()).toMatchImageData([
    [0, 0, 0, 255, 255],
    [0, 0, 0, 255, 255],
    [0, 0, 0, 255, 255],
    [0, 0, 0, 255, 255],
    [0, 0, 0, 255, 255],
  ]);
});

test('another GREY image 5x5', () => {
  const image = testUtils.createGreyImage([
    [255, 255, 255, 255, 255],
    [255, 255, 0, 255, 255],
    [255, 0, 0, 0, 255],
    [255, 255, 0, 255, 255],
    [255, 255, 255, 255, 255],
  ]);

  const expected = [
    [255, 0, 0, 0, 255],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [255, 0, 0, 0, 255],
  ];

  expect(image.erode()).toMatchImageData(expected);
});

test('GREY image 5x5, 1x3 onlyOnes kernel', () => {
  const kernel = [[1, 1, 1]];

  const image = testUtils.createGreyImage([
    [255, 255, 255, 255, 255],
    [255, 255, 0, 255, 255],
    [255, 0, 0, 0, 255],
    [255, 255, 0, 255, 255],
    [255, 255, 255, 255, 255],
  ]);

  const expected = [
    [255, 255, 255, 255, 255],
    [255, 0, 0, 0, 255],
    [0, 0, 0, 0, 0],
    [255, 0, 0, 0, 255],
    [255, 255, 255, 255, 255],
  ];

  expect(image.erode({ kernel })).toMatchImageData(expected);
});

test('GREY image 5x5, 1x3 kernel with zeros', () => {
  const kernel = [[1, 0, 1]];

  const image = testUtils.createGreyImage([
    [255, 255, 255, 255, 255],
    [255, 255, 0, 255, 255],
    [255, 0, 0, 0, 255],
    [255, 255, 0, 255, 255],
    [255, 255, 255, 255, 255],
  ]);

  const expected = [
    [255, 255, 255, 255, 255],
    [255, 0, 255, 0, 255],
    [0, 0, 0, 0, 0],
    [255, 0, 255, 0, 255],
    [255, 255, 255, 255, 255],
  ];

  expect(image.erode({ kernel })).toMatchImageData(expected);
});

test('mask 5x5', () => {
  const mask = testUtils.createMask(`
      1 0 1 1 1
      1 0 1 1 1
      1 0 1 1 1
      1 0 1 1 1
      1 0 1 1 1
    `);

  expect(mask.erode()).toMatchMaskData(`
        0 0 0 1 1
        0 0 0 1 1
        0 0 0 1 1
        0 0 0 1 1
        0 0 0 1 1
      `);
});

test('erode with 2 iterations', () => {
  const mask = testUtils.createMask(`
      1 0 1 1 1
      1 0 1 1 1
      1 0 1 1 1
      1 0 1 1 1
      1 0 1 1 1
    `);

  const expected = `
      0 0 0 0 1
      0 0 0 0 1
      0 0 0 0 1
      0 0 0 0 1
      0 0 0 0 1
    `;

  expect(mask.erode({ iterations: 2 })).toMatchMaskData(expected);
});

test('5x5 mask', () => {
  const mask = testUtils.createMask(`
      1 1 1 1 1
      1 1 0 1 1
      1 0 0 0 1
      1 1 0 1 1
      1 1 1 1 1
    `);

  expect(mask.erode()).toMatchMaskData(`
      1 0 0 0 1
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      1 0 0 0 1
    `);
});

test('another 5x5 mask', () => {
  const mask = testUtils.createMask(`
      1 1 0 1 1
      1 1 0 1 1
      0 0 0 0 0
      1 1 0 1 1
      1 1 0 1 1
    `);

  const expected = `
      1 0 0 0 1
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      1 0 0 0 1`;

  expect(mask.erode()).toMatchMaskData(expected);
});

test('mask 5x3, 3x1 kernel onlyOnes', () => {
  const kernel = [[1], [1], [1]];
  const mask = testUtils.createMask(`
      1 1 0
      1 0 0
      1 1 1
      0 0 1
      0 1 1
    `);

  const expected = `
      1 0 0
      1 0 0
      0 0 0
      0 0 1
      0 0 1
    `;

  expect(mask.erode({ kernel })).toMatchMaskData(expected);
});

test('mask 5x3, 3x1 kernel with zeros', () => {
  const kernel = [[1], [1], [0]];
  const mask = testUtils.createMask(`
      1 1 0
      1 0 0
      1 1 1
      0 0 1
      0 1 1
    `);

  const expected = `
      1 1 0
      1 0 0
      1 0 0
      0 0 1
      0 0 1
    `;

  expect(mask.erode({ kernel })).toMatchMaskData(expected);
});

test('mask 5x5, kernel with holes', () => {
  const kernel = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ];
  const mask = testUtils.createMask(`
      1 1 1 1 1
      1 1 1 1 1
      1 1 1 0 1
      1 1 1 1 1
      1 1 1 1 1
    `);

  const expected = `
      1 1 1 1 1
      1 1 0 0 0
      1 1 0 1 0
      1 1 0 0 0
      1 1 1 1 1
    `;

  expect(mask.erode({ kernel })).toMatchMaskData(expected);
});
