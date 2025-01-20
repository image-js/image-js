import type { Point } from '../../geometry/index.js';
import { variance } from '../variance.js';

test('1x1 RGB image', () => {
  const image = testUtils.createGreyImage([[1, 2, 3]]);

  expect(variance(image)).toStrictEqual([2 / 3]);
});

test('GREY image', () => {
  const image = testUtils.createGreyImage([
    [10, 20, 30, 40],
    [50, 60, 70, 80],
  ]);

  const result = image.variance();

  expect(result).toStrictEqual([525]);
});

test('variance from points', () => {
  const image = testUtils.createGreyImage([
    [10, 20, 30, 40],
    [50, 60, 70, 80],
  ]);

  const points = [
    { column: 0, row: 0 },
    { column: 1, row: 0 },
    { column: 2, row: 0 },
    { column: 3, row: 0 },
  ];

  const result = image.variance({ points });

  expect(result).toStrictEqual([125]);
});
test('must throw if array is empty', () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 2, 2],
    [1, 2, 3, 2],
  ]);
  const points: Point[] = [];
  expect(() => {
    const result = image.median({ points });
    return result;
  }).toThrow('Array of coordinates is empty.');
});
test("must throw if point's coordinates are invalid", () => {
  const image = testUtils.createGreyImage([
    [1, 2, 2, 2],
    [1, 2, 3, 2],
  ]);
  const points: Point[] = [{ column: 0, row: 2 }];
  expect(() => {
    const result = image.median({ points });
    return result;
  }).toThrow('Invalid coordinate: {column: 0, row: 2}');
});
test("must throw if point's coordinates are invalid", () => {
  const image = testUtils.createGreyImage([
    [1, 2, 2, 2],
    [1, 2, 3, 2],
  ]);
  const points: Point[] = [{ column: 4, row: 1 }];
  expect(() => {
    const result = image.median({ points });
    return result;
  }).toThrow('Invalid coordinate: {column: 4, row: 1}');
});
test('must throw if point has negative values.', () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 3, 0],
    [1, 2, 3, 0],
  ]);
  const points: Point[] = [{ column: -14, row: 0 }];

  expect(() => {
    const result = image.mean({ points });
    return result;
  }).toThrow('Invalid coordinate: {column: -14, row: 0}');
});
