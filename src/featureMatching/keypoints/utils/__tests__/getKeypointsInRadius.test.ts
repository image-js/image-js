import { expect, test } from 'vitest';

import type { OrientedFastKeypoint } from '../../getOrientedFastKeypoints.js';
import { getKeypointsInRadius } from '../getKeypointsInRadius.js';

test('array of 3 keypoints', () => {
  const keypoints: OrientedFastKeypoint[] = [
    { origin: { row: 0, column: 0 }, angle: 0, score: 3 },
    { origin: { row: 1, column: 0 }, angle: 0, score: 5 },
    { origin: { row: 0, column: 2 }, angle: 0, score: 6 },
  ];
  const result = getKeypointsInRadius(keypoints, 1);

  expect(result).toStrictEqual([[1], [0], []]);
});
