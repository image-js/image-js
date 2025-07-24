import { expect, test } from 'vitest';

const image = testUtils.createGreyImage([
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
]);

test('Sobel', () => {
  const result = image.derivativeFilter({
    borderType: 'constant',
  });

  expect(result).toMatchImageData([
    [4, 4, 4],
    [4, 0, 4],
    [4, 4, 4],
  ]);
});

test('Scharr', () => {
  const result = image.derivativeFilter({
    filter: 'scharr',
    borderType: 'constant',
  });

  expect(result).toMatchImageData([
    [18, 16, 18],
    [16, 0, 16],
    [18, 16, 18],
  ]);
});

test('Prewitt', () => {
  const result = image.derivativeFilter({
    filter: 'prewitt',
    borderType: 'constant',
  });

  expect(result).toMatchImageData([
    [2, 3, 2],
    [3, 0, 3],
    [2, 3, 2],
  ]);
});
