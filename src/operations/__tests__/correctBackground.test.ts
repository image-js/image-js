import { Point } from '../../geometry';
import { sampleBackgroundPoints } from '../../utils/sampleBackgroundPoints';
import { correctBackground } from '../correctBackground';
import { getMaskFromCannyEdge } from '../getMaskFromCannyEdge';

test('basic test', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
  ]);
  const mask = getMaskFromCannyEdge(image);
  const points = sampleBackgroundPoints(image, {
    mask,
    gridWidth: 3,
    gridHeight: 3,
  });
  const newImage = correctBackground(image, {
    background: points,
    order: 2,
    backgroundKind: 'dark',
  });
  const result = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  expect(newImage).toEqual(result);
});

test('test with object 8x8 and manually picked points', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 250, 250, 250, 250, 7, 8],
    [1, 2, 250, 4, 5, 250, 7, 8],
    [1, 2, 250, 4, 5, 250, 7, 8],
    [1, 2, 250, 250, 250, 250, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
  ]);
  const points: Point[] = [
    { column: 0, row: 0 },
    { column: 1, row: 6 },
    { column: 2, row: 1 },
    { column: 3, row: 1 },
    { column: 4, row: 6 },
    { column: 3, row: 7 },
    { column: 4, row: 7 },
    { column: 5, row: 7 },
  ];

  const newImage = correctBackground(image, {
    background: points,
    backgroundKind: 'dark',
  });
  const result = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 247, 246, 245, 244, 0, 0],
    [0, 0, 247, 0, 0, 244, 0, 0],
    [0, 0, 247, 0, 0, 244, 0, 0],
    [0, 0, 247, 246, 245, 244, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  expect(newImage).toEqual(result);
});

test('test with object 8x8 and sampled points', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 250, 250, 250, 250, 7, 8],
    [1, 2, 250, 4, 5, 250, 7, 8],
    [1, 2, 250, 4, 5, 250, 7, 8],
    [1, 2, 250, 250, 250, 250, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
  ]);
  const mask = getMaskFromCannyEdge(image, { iterations: 0 });

  const points = sampleBackgroundPoints(image, {
    mask,
    gridWidth: 5,
    gridHeight: 5,
  });
  const newImage = correctBackground(image, {
    background: points,
    order: 3,
    backgroundKind: 'dark',
  });
  const result = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 247, 246, 245, 244, 0, 0],
    [0, 0, 247, 0, 0, 244, 0, 0],
    [0, 0, 247, 0, 0, 244, 0, 0],
    [0, 0, 247, 246, 245, 244, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  expect(newImage).toEqual(result);
});

test('basic screws image test', () => {
  const image = testUtils.load('various/screws.png').grey();
  const mask = getMaskFromCannyEdge(image);
  const points = sampleBackgroundPoints(image, {
    mask,
    gridWidth: 15,
    gridHeight: 15,
  });
  const newImage = correctBackground(image, {
    background: points,
    order: 2,
    backgroundKind: 'light',
  });
  expect(newImage).toMatchImageSnapshot();
});

test('basic sudoku image test', () => {
  const image = testUtils.load('various/sudoku.jpg').grey();
  const mask = getMaskFromCannyEdge(image, { iterations: 0 });
  const points = sampleBackgroundPoints(image, {
    mask,
    gridWidth: 15,
    gridHeight: 15,
  });
  const newImage = correctBackground(image, { background: points });
  expect(newImage).toMatchImageSnapshot();
});
test('throw if insufficient number of points', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
  ]);
  const mask = getMaskFromCannyEdge(image);
  const points = sampleBackgroundPoints(image, {
    mask,
    gridWidth: 2,
    gridHeight: 2,
  });

  expect(() => {
    correctBackground(image, {
      background: points,
      order: 2,
      backgroundKind: 'dark',
    });
  }).toThrow('Insufficient number of points to create regression model.');
});
