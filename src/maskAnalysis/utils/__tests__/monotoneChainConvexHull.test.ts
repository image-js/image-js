import { monotoneChainConvexHull as mcch } from '../monotoneChainConvexHull';

test('basic square', () => {
  const result = mcch([
    { column: 0, row: 0 },
    { column: 0, row: 1 },
    { column: 1, row: 0 },
    { column: 1, row: 1 },
  ]);
  expect(result).toStrictEqual([
    { column: 0, row: 0 },
    { column: 0, row: 1 },
    { column: 1, row: 1 },
    { column: 1, row: 0 },
  ]);
});

test('mixed square', () => {
  const result = mcch([
    { column: 0, row: 0 },
    { column: 1, row: 0 },
    { column: 0, row: 1 },
    { column: 1, row: 1 },
    { column: 0, row: 1 },
    { column: 1, row: 1 },
    { column: 0, row: 2 },
    { column: 1, row: 2 },
    { column: 1, row: 0 },
    { column: 2, row: 0 },
    { column: 1, row: 1 },
    { column: 2, row: 1 },
    { column: 1, row: 1 },
    { column: 2, row: 1 },
    { column: 1, row: 2 },
    { column: 2, row: 2 },
  ]);
  expect(result).toStrictEqual([
    { column: 0, row: 0 },
    { column: 0, row: 2 },
    { column: 2, row: 2 },
    { column: 2, row: 0 },
  ]);
});

test('rectangle with inside points', () => {
  const result = mcch([
    { column: 1, row: 1 },
    { column: 3, row: 0 },
    { column: 2, row: 1 },
    { column: 3, row: 2 },
    { column: 1, row: 2 },
    { column: 0, row: 2 },
    { column: 0, row: 0 },
  ]);
  expect(result).toStrictEqual([
    { column: 0, row: 0 },
    { column: 0, row: 2 },
    { column: 3, row: 2 },
    { column: 3, row: 0 },
  ]);
});

test('more complex shape', () => {
  const result = mcch([
    { column: -1, row: -1 },
    { column: 0, row: 0 },
    { column: 0, row: -2 },
    { column: 1, row: 0 },
    { column: 1, row: 2 },
    { column: 4, row: 1 },
    { column: 0, row: 8 },
    { column: 3, row: 6 },
    { column: 2, row: 4 },
  ]);
  expect(result).toStrictEqual([
    { column: -1, row: -1 },
    { column: 0, row: 8 },
    { column: 3, row: 6 },
    { column: 4, row: 1 },
    { column: 0, row: -2 },
  ]);
});

test('already sorted', () => {
  const result = mcch(
    [
      { column: 0, row: 0 },
      { column: 0, row: 2 },
      { column: 1, row: 1 },
      { column: 1, row: 2 },
      { column: 2, row: 1 },
      { column: 3, row: 0 },
      { column: 3, row: 2 },
    ],
    { sorted: true },
  );
  expect(result).toStrictEqual([
    { column: 0, row: 0 },
    { column: 0, row: 2 },
    { column: 3, row: 2 },
    { column: 3, row: 0 },
  ]);
});
