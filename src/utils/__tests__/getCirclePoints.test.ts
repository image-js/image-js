import { getCirclePoints } from '../getCirclePoints';

test('circle with radius 1', () => {
  expect(getCirclePoints(1)).toStrictEqual([
    { row: 0, column: 1 },
    { row: 1, column: 0 },
    { row: 0, column: -1 },
    { row: -1, column: 0 },
  ]);
});
test('circle with radius 3', () => {
  const expected = [
    { row: 0, column: 3 },
    { row: 1, column: 3 },
    { row: 2, column: 2 },
    { row: 3, column: 1 },
    { row: 3, column: 0 },
    { row: 3, column: -1 },
    { row: 2, column: -2 },
    { row: 1, column: -3 },
    { row: 0, column: -3 },
    { row: -1, column: -3 },
    { row: -2, column: -2 },
    { row: -3, column: -1 },
    { row: -3, column: 0 },
    { row: -3, column: 1 },
    { row: -2, column: 2 },
    { row: -1, column: 3 },
  ];

  let result = getCirclePoints(3);

  expect(result).not.toStrictEqual(expected);
});
