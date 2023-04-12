const kernelX = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
];
const kernelY = [
  [1, 0, 0],
  [0, 0, 0],
  [0, 0, 1],
];

const image = testUtils.createGreyImage([
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
]);

test('gradientX', () => {
  const result = image.gradientFilter({
    kernelX,
    borderType: 'constant',
  });

  expect(result).toMatchImageData([
    [1, 1, 1],
    [1, 2, 2],
    [1, 2, 2],
  ]);
});

test('gradientY', () => {
  const result = image.gradientFilter({
    kernelY,
    borderType: 'constant',
  });

  expect(result).toMatchImageData([
    [1, 1, 0],
    [1, 2, 1],
    [0, 1, 1],
  ]);
});

test('gradientX and gradientY', () => {
  const result = image.gradientFilter({
    kernelX,
    kernelY,
    borderType: 'constant',
  });
  expect(result).toMatchImageData([
    [1, 1, 1],
    [1, 2, 2],
    [1, 2, 2],
  ]);
});

// To make TypeScript know it's a module
export {};
