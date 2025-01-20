import { normalize, sortByColumnRow } from '../points.js';

describe('normalize', () => {
  it('simple numbers', () => {
    const point = { column: 3, row: 4 };
    expect(normalize(point)).toStrictEqual({ column: 3 / 5, row: 4 / 5 });
  });
  it('other simple numbers', () => {
    const point = { column: 6, row: 8 };
    expect(normalize(point)).toStrictEqual({ column: 6 / 10, row: 8 / 10 });
  });
});

test('sort points', () => {
  const points = [
    { row: 0, column: 0 },
    { row: 0, column: 1 },
    { row: 1, column: 0 },
    { row: 0, column: -1 },
    { row: 0, column: 0 },
    { row: -1, column: 0 },
  ];
  const sorted = sortByColumnRow(points);
  expect(sorted).toStrictEqual([
    { row: 0, column: -1 },
    { row: -1, column: 0 },
    { row: 0, column: 0 },
    { row: 0, column: 0 },
    { row: 1, column: 0 },
    { row: 0, column: 1 },
  ]);
});
