import Matrix from 'ml-matrix';

import { applyAffineTransfom } from '../applyAffineTransform';
import { createAffineTransformModel } from '../createAffineTransformModel';
import { getPointsFromMatrix } from '../getPointsFromMatrix';

test('6 points aligned', () => {
  const source = [
    { row: 2, column: 2 },
    { row: 3, column: 2 },
    { row: 4, column: 2 },
    { row: 5, column: 2 },
    { row: 6, column: 2 },
    { row: 7, column: 2 },
  ];
  const expected = [
    { row: 2, column: -2 },
    { row: 1, column: -2 },
    { row: 0, column: -2 },
    { row: -1, column: -2 },
    { row: -2, column: -2 },
    { row: -3, column: -2 },
  ];

  const model = createAffineTransformModel([180, 0, 4, 1]);
  const result = applyAffineTransfom(source, model);

  expect(result).toBeDeepCloseTo(expected);
});

test('rectangle with scale = 2', () => {
  const sourceMatrix = new Matrix([
    [1, 5, 5, 1],
    [-4, -4, -2, -2],
    [1, 1, 1, 1],
  ]);
  const expectedMatrix = new Matrix([
    [-6, -6, -2, -2],
    [10, 2, 2, 10],
    [1, 1, 1, 1],
  ]);
  const source = getPointsFromMatrix(sourceMatrix);
  const expected = getPointsFromMatrix(expectedMatrix);

  const model = createAffineTransformModel([-90, 2, 12, 2]);
  const result = applyAffineTransfom(source, model);
  expect(expected).toStrictEqual(result);
});

test('only one point', () => {
  const angle = Math.PI / 6;

  const sourceMatrix = new Matrix([
    [5 * Math.cos(angle)],
    [-5 * Math.sin(angle)],
    [1],
  ]);
  const expectedMatrix = new Matrix([[0], [0], [1]]);
  const source = getPointsFromMatrix(sourceMatrix);
  const expected = getPointsFromMatrix(expectedMatrix);

  const model = createAffineTransformModel([angle, -1, 0, 1 / 5]);
  const result = applyAffineTransfom(source, model);
  // @ts-expect-error: jest matcher types are wrong
  expect(result).toBeDeepCloseTo(expected);
});
