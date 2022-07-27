import { deleteDuplicates } from '../deleteDuplicates';

test('should remove duplicate points', () => {
  const points = [
    { row: 0, column: 0 },
    { row: 0, column: 0 },
    { row: 3, column: 0 },
    { row: 3, column: 2 },
    { row: 3, column: 2 },
    { row: 0, column: 2 },
  ];

  const expected = [
    { row: 0, column: 0 },
    { row: 3, column: 0 },
    { row: 3, column: 2 },
    { row: 0, column: 2 },
  ];

  const result = deleteDuplicates(points);

  expect(result).toStrictEqual(expected);
});

test('first and last are the same', () => {
  const points = [
    { row: 0, column: 0 },
    { row: 3, column: 0 },
    { row: 3, column: 2 },
    { row: 0, column: 0 },
  ];

  const expected = [
    { row: 0, column: 0 },
    { row: 3, column: 0 },
    { row: 3, column: 2 },
  ];

  const result = deleteDuplicates(points);

  expect(result).toStrictEqual(expected);
});
