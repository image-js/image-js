import { getCirclePoints } from '../getCirclePoints';

test('circle with radius 1', () => {
  expect(getCirclePoints(1)).toStrictEqual([
    { row: 0, column: 1 },
    { row: 1, column: 0 },
    { row: 0, column: -1 },
    { row: -1, column: 0 },
  ]);
});

test('compass points, radius 1', () => {
  expect(getCirclePoints(1)).toStrictEqual([
    { row: 0, column: 1 },
    { row: 1, column: 0 },
    { row: 0, column: -1 },
    { row: -1, column: 0 },
  ]);
});
