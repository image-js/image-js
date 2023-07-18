test('GREY image 5x5, default kernel', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 255, 0, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 0, 255, 0, 0],
  ]);

  expect(image.topHat()).toMatchImageData([
    [0, 0, 255, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 255, 0, 0],
  ]);
});

test('GREY image 5x5,default kernel, 2 iterations', () => {
  const kernel = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];
  const image = testUtils.createGreyImage([
    [0, 0, 255, 0, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 0, 255, 0, 0],
  ]);

  expect(image.topHat({ kernel, iterations: 2 })).toMatchImageData([
    [0, 0, 255, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 255, 0, 0],
  ]);
});

test('Mask 5x5, default kernel', () => {
  const image = testUtils.createMask([
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ]);

  expect(image.topHat()).toMatchMaskData([
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
  ]);
});
