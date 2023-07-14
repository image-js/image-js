import getExtrema from '../../../compute/getExtrema';
import { filterPoints } from '../filterPoints';

test('combine minimum points after getExtrema function', () => {
  let image = testUtils.createGreyImage([
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 2, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 3, 3, 3, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 2, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ]);

  let points = getExtrema(image, { kind: 'minimum' });

  let result = filterPoints(points, image, {
    removeClosePoints: 2,
    kind: 'minimum',
    channel: 0,
  });
  expect(result).toStrictEqual([
    { column: 3, row: 5 },
    { column: 6, row: 7 },
    { column: 3, row: 2 },
  ]);
});

test('combine maximum points after getExtrema function', () => {
  let image = testUtils.createGreyImage([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 4, 4, 4, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 6, 1, 6, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 6, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 5, 1, 6, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]);

  let points = getExtrema(image, {
    kind: 'maximum',
    algorithm: 'star',
  });

  let result = filterPoints(points, image, {
    kind: 'maximum',
    removeClosePoints: 3,
  });
  expect(result).toStrictEqual([
    { column: 2, row: 2 },
    { column: 3, row: 5 },
    { column: 7, row: 6 },
  ]);
});
test('test error handling', () => {
  let image = testUtils.createRgbaImage([
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 6, 1, 1],
    [1, 1, 1, 1],
    [1, 5, 6, 1],
  ]);
  expect(() => {
    let points = getExtrema(image, {
      kind: 'maximum',
      algorithm: 'star',
    });

    let result = filterPoints(points, image, {
      kind: 'maximum',
      removeClosePoints: 0,
    });
    return result;
  }).toThrowError(
    'image channel must be specified or image must have only one channel',
  );
});
