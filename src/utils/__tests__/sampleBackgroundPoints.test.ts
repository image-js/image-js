import { getMaskFromCannyEdge } from '../../operations/getMaskFromCannyEdge.js';
import { sampleBackgroundPoints } from '../sampleBackgroundPoints.js';

test('basic test', () => {
  const image = testUtils.createGreyImage([
    [2, 2, 2, 2, 2],
    [2, 50, 50, 50, 2],
    [2, 50, 2, 50, 2],
    [2, 50, 50, 50, 2],
    [2, 2, 2, 2, 2],
  ]);
  const mask = getMaskFromCannyEdge(image, { iterations: 0 });
  const points = sampleBackgroundPoints(image, {
    mask,
    gridWidth: 3,
    gridHeight: 3,
  });
  expect(points).toEqual([
    { column: 0, row: 0 },
    { column: 1, row: 0 },
    { column: 2, row: 0 },
    { column: 3, row: 0 },
    { column: 4, row: 0 },
    { column: 0, row: 1 },
    { column: 4, row: 1 },
    { column: 0, row: 2 },
    { column: 4, row: 2 },
    { column: 0, row: 3 },
    { column: 4, row: 3 },
    { column: 0, row: 4 },
    { column: 1, row: 4 },
    { column: 2, row: 4 },
    { column: 3, row: 4 },
    { column: 4, row: 4 },
  ]);
});

test('basic test with basic mask', () => {
  const image = testUtils.createGreyImage([
    [0, 200, 0, 0, 0, 0, 0],
    [0, 200, 0, 0, 0, 0, 0],
    [0, 200, 200, 200, 200, 0, 0],
    [0, 200, 0, 200, 0, 0, 0],
    [0, 200, 0, 0, 200, 0, 0],
    [0, 200, 0, 0, 0, 0, 0],
    [0, 200, 0, 0, 0, 0, 200],
  ]);
  const mask = image.threshold();
  const points = sampleBackgroundPoints(image, {
    mask,
    gridWidth: 3,
    gridHeight: 3,
  });
  expect(points).toEqual([
    { column: 3, row: 1 },
    { column: 5, row: 1 },
    { column: 5, row: 3 },
    { column: 3, row: 5 },
    { column: 5, row: 5 },
  ]);
});

test('basic test with basic mask', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 200, 0, 0, 0, 0, 0],
    [0, 200, 200, 200, 200, 200, 200],
    [0, 200, 0, 0, 0, 0, 200],
    [0, 200, 200, 200, 200, 200, 200],
    [0, 200, 0, 0, 0, 0, 0],
  ]);
  const mask = image.threshold();
  const points = sampleBackgroundPoints(image, {
    mask,
    gridWidth: 3,
    gridHeight: 3,
  });
  expect(points).toEqual([
    { column: 1, row: 1 },
    { column: 3, row: 1 },
    { column: 5, row: 1 },
  ]);
});

test('basic test of default values', () => {
  const image = testUtils.createGreyImage([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);

  const points = sampleBackgroundPoints(image, { gridHeight: 3, gridWidth: 3 });
  expect(points).toEqual([
    { column: 0, row: 0 },
    { column: 1, row: 0 },
    { column: 2, row: 0 },
    { column: 0, row: 1 },
    { column: 1, row: 1 },
    { column: 2, row: 1 },
    { column: 0, row: 2 },
    { column: 1, row: 2 },
    { column: 2, row: 2 },
  ]);
});

test('throw an error', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const mask = getMaskFromCannyEdge(image, { iterations: 0 });
  expect(() =>
    sampleBackgroundPoints(image, { mask, gridWidth: -3, gridHeight: 3 }),
  ).toThrow(`The grid has bigger width than the image. Grid's width: -3`);
});
