import { expect, test } from 'vitest';

test('grey image 5x5', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
  ]);

  const result = image.medianFilter({
    borderType: 'reflect101',
    cellSize: 3,
    borderValue: 0,
  });

  expect(result).toMatchImageData([
    [2, 2, 3, 4, 4],
    [2, 2, 3, 4, 4],
    [2, 2, 3, 4, 4],
    [2, 2, 3, 4, 4],
    [2, 2, 3, 4, 4],
  ]);
});

test('grey image 5x5 with bigger values', () => {
  const image = testUtils.createGreyImage([
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
  ]);
  const result = image.medianFilter({
    borderType: 'reflect101',
    cellSize: 1,
    borderValue: 0,
  });

  expect(result).toMatchImageData([
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
  ]);
});

test('grey image 5x5 with different borderType and borderValue', () => {
  const image = testUtils.createGreyImage([
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
  ]);
  const result = image.medianFilter({
    borderType: 'constant',
    cellSize: 7,
    borderValue: 1,
  });

  expect(result).toMatchImageData([
    [1, 1, 1, 1, 1],
    [1, 2, 2, 2, 1],
    [1, 2, 2, 2, 1],
    [1, 2, 2, 2, 1],
    [1, 1, 1, 1, 1],
  ]);
});

test('error handling', () => {
  const image = testUtils.createGreyImage([
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
  ]);

  expect(() => {
    image.medianFilter({
      borderType: 'constant',
      cellSize: 2,
      borderValue: 1,
    });
  }).toThrow(
    new RangeError(
      'Invalid property "cellSize". Must be an odd number. Received 2.',
    ),
  );

  expect(() => {
    image.medianFilter({
      borderType: 'constant',
      cellSize: 0,
      borderValue: 1,
    });
  }).toThrow(
    new RangeError(
      'Invalid property "cellSize". Must be greater than 0. Received 0.',
    ),
  );
});
