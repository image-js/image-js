import { getMaskFromCannyEdge } from '../getMaskFromCannyEdge.js';

test('basic test', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3, 4, 5],
    [1, 50, 50, 50, 5],
    [1, 50, 3, 50, 5],
    [1, 50, 50, 50, 5],
    [1, 2, 3, 4, 5],
  ]);
  const mask = testUtils.createMask([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ]);
  const fromCannyMask = getMaskFromCannyEdge(image, { iterations: 0 });
  expect(fromCannyMask).toEqual(mask);
});

test('testing 10x10 with dilation', () => {
  const image = testUtils.createGreyImage([
    [40, 40, 40, 4, 5, 6, 7, 8, 9, 10],
    [40, 2, 40, 0, 5, 6, 7, 8, 9, 10],
    [40, 2, 3, 40, 5, 6, 7, 8, 9, 10],
    [40, 0, 0, 0, 5, 6, 7, 8, 9, 10],
    [1, 1, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 5, 5, 70, 70, 10],
    [1, 2, 3, 4, 5, 6, 7, 60, 9, 70],
    [1, 2, 3, 4, 5, 40, 40, 8, 9, 70],
    [1, 2, 3, 4, 5, 6, 7, 70, 9, 70],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  ]);
  const mask = testUtils.createMask([
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  ]);
  const fromCannyMask = getMaskFromCannyEdge(image);
  expect(fromCannyMask).toEqual(mask);
});

test('testing 7x7 without dilation', () => {
  const image = testUtils.createGreyImage([
    [50, 50, 50, 50, 50, 50, 50],
    [50, 0, 0, 0, 0, 0, 0],
    [50, 0, 0, 0, 0, 0, 0],
    [50, 0, 0, 0, 50, 0, 0],
    [50, 0, 0, 0, 50, 0, 0],
    [50, 0, 0, 0, 50, 0, 0],
    [50, 50, 50, 50, 50, 0, 0],
  ]);
  const mask = testUtils.createMask([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]);
  const fromCannyMask = getMaskFromCannyEdge(image, { iterations: 0 });
  expect(fromCannyMask).toEqual(mask);
});

test('testing 7x7 with dilation', () => {
  const image = testUtils.createGreyImage([
    [50, 50, 50, 50, 50, 50, 50],
    [50, 0, 0, 0, 0, 0, 0],
    [50, 0, 0, 0, 0, 0, 0],
    [50, 0, 0, 0, 50, 0, 0],
    [50, 0, 0, 0, 50, 0, 0],
    [50, 0, 0, 0, 50, 0, 0],
    [50, 50, 50, 50, 50, 0, 0],
  ]);
  const mask = testUtils.createMask([
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ]);
  const fromCannyMask = getMaskFromCannyEdge(image);
  expect(fromCannyMask).toEqual(mask);
});
