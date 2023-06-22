import { getMatrixFromPoints } from '../getMatrixFromPoints';

test('4 points', () => {
  const side = 3;
  const points = [
    { row: 1, column: 1 },
    { row: side, column: 0 },
    { row: side, column: -side },
    { row: 0, column: -side },
  ];

  const result = getMatrixFromPoints(points);

  expect(result.to2DArray()).toStrictEqual([
    [1, 0, -3, -3],
    [1, 3, 3, 0],
    [1, 1, 1, 1],
  ]);
});
