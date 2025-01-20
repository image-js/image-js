import { getConvexHull } from '../getConvexHull.js';

test('cross', () => {
  const mask = testUtils.createMask([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);

  const convexHull = getConvexHull(mask);
  expect(convexHull).toBeDeepCloseTo(
    {
      points: [
        { column: 0, row: 1 },
        { column: 0, row: 2 },
        { column: 1, row: 3 },
        { column: 2, row: 3 },
        { column: 3, row: 2 },
        { column: 3, row: 1 },
        { column: 2, row: 0 },
        { column: 1, row: 0 },
      ],
      surface: 7,
      perimeter: 9.7,
    },
    1,
  );
});

test('small triangle', () => {
  const mask = testUtils.createMask([
    [0, 0, 1],
    [0, 1, 1],
    [1, 1, 1],
  ]);

  const convexHull = getConvexHull(mask);
  expect(convexHull).toBeDeepCloseTo(
    {
      points: [
        { column: 0, row: 2 },
        { column: 0, row: 3 },
        { column: 3, row: 3 },
        { column: 3, row: 0 },
        { column: 2, row: 0 },
      ],
      surface: 7,
      perimeter: 10.82,
    },
    1,
  );
});
test('1 pixel ROI', () => {
  const mask = testUtils.createMask([
    [0, 0, 0],
    [0, 0, 1],
    [0, 0, 0],
  ]);

  const convexHull = getConvexHull(mask);
  expect(convexHull).toBeDeepCloseTo(
    {
      points: [
        { column: 2, row: 1 },
        { column: 2, row: 2 },
        { column: 3, row: 2 },
        { column: 3, row: 1 },
      ],
      surface: 1,
      perimeter: 4,
    },
    1,
  );
});
test('2 pixels ROI', () => {
  const mask = testUtils.createMask([
    [0, 0, 0],
    [0, 1, 1],
    [0, 0, 0],
  ]);

  const convexHull = getConvexHull(mask);
  expect(convexHull).toBeDeepCloseTo(
    {
      points: [
        { column: 1, row: 1 },
        { column: 1, row: 2 },
        { column: 3, row: 2 },
        { column: 3, row: 1 },
      ],
      surface: 2,
      perimeter: 6,
    },
    1,
  );
});
test('5x5 cross', () => {
  const mask = testUtils.createMask([
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ]);

  const convexHull = getConvexHull(mask);
  expect(convexHull).toBeDeepCloseTo(
    {
      points: [
        { column: 0, row: 2 },
        { column: 0, row: 3 },
        { column: 2, row: 5 },
        { column: 3, row: 5 },
        { column: 5, row: 3 },
        { column: 5, row: 2 },
        { column: 3, row: 0 },
        { column: 2, row: 0 },
      ],
      surface: 17,
      perimeter: 15.3,
    },
    1,
  );
});
test('random shape', () => {
  const mask = testUtils.createMask([
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ]);

  const convexHull = getConvexHull(mask);
  expect(convexHull.points).toStrictEqual([
    { column: 0, row: 4 },
    { column: 0, row: 5 },
    { column: 1, row: 5 },
    { column: 5, row: 3 },
    { column: 5, row: 2 },
    { column: 3, row: 0 },
    { column: 2, row: 0 },
  ]);
});
test('empty mask', () => {
  const mask = testUtils.createMask([
    [0, 0],
    [0, 0],
  ]);

  const result = mask.getConvexHull();

  expect(result).toStrictEqual({
    points: [],
    surface: 0,
    perimeter: 0,
  });
});
