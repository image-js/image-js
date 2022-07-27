test('GREY image 5x5', () => {
  const image = testUtils.createGreyImage([
    [255, 255, 0, 255, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 255, 0, 255, 255],
  ]);

  expect(image.open()).toMatchImageData([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test('GREY image 5x5, 2 iterations', () => {
  const image = testUtils.createGreyImage([
    [255, 255, 255, 255, 255],
    [255, 255, 0, 255, 255],
    [255, 0, 0, 0, 255],
    [255, 255, 0, 255, 255],
    [255, 255, 255, 255, 255],
  ]);

  expect(image.open({ iterations: 2 })).toMatchImageData([
    [255, 255, 0, 255, 255],
    [255, 255, 0, 255, 255],
    [0, 0, 0, 0, 0],
    [255, 255, 0, 255, 255],
    [255, 255, 0, 255, 255],
  ]);
});

test('mask 5x5, 1x3 kernel with onlyOnes', () => {
  let kernel = [[1, 1, 1]];

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
