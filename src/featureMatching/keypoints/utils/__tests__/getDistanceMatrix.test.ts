import { expect, test } from 'vitest';

import type { OrientedFastKeypoint } from '../../getOrientedFastKeypoints.js';
import { getDistanceMatrix } from '../getDistanceMatrix.js';

test('array of 3 keypoints', () => {
  const keypoints: OrientedFastKeypoint[] = [
    { origin: { row: 0, column: 0 }, angle: 0, score: 3 },
    { origin: { row: 1, column: 0 }, angle: 0, score: 5 },
    { origin: { row: 0, column: 2 }, angle: 0, score: 6 },
  ];
  const result = getDistanceMatrix(keypoints);

  const array = result.map((line) => Array.from(line));

  expect(array).toStrictEqual([
    [0, 1, 4],
    [1, 0, 5],
    [4, 5, 0],
  ]);
});
