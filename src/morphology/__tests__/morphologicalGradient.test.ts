test('GREY image 5x5', () => {
  let image = testUtils.createGreyImage([
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
  ]);

  expect(image.morphologicalGradient()).toMatchImageData([
    [255, 255, 0, 255, 255],
    [255, 255, 0, 255, 255],
    [255, 255, 0, 255, 255],
    [255, 255, 0, 255, 255],
    [255, 255, 0, 255, 255],
  ]);
});

test('GREY image 5x5, 2 iterations', () => {
  let image = testUtils.createGreyImage([
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
  ]);

  expect(image.morphologicalGradient({ iterations: 2 })).toMatchImageData([
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
  ]);
});

test('mask 5x5', () => {
  let image = testUtils.createGreyImage([
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
  ]);

  expect(image.morphologicalGradient()).toMatchImageData([
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
  ]);
});

test('mask 5x5, 2 iterations', () => {
  let mask = testUtils.createMask([
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
  ]);

  expect(mask.morphologicalGradient({ iterations: 2 })).toMatchMask(mask);
});
