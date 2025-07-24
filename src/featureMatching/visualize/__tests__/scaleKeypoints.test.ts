import { expect, test } from 'vitest';

import type { FastKeypoint } from '../../keypoints/getFastKeypoints.js';
import { scaleKeypoints } from '../scaleKeypoints.js';

test('scale = 1', () => {
  const keypoints: FastKeypoint[] = [
    { origin: { row: 2, column: 5 }, score: 42 },
  ];

  const result = scaleKeypoints(keypoints, 1);

  expect(result).toStrictEqual(keypoints);
  expect(result).not.toBe(keypoints);
});

test('scale = 3', () => {
  const keypoints: FastKeypoint[] = [
    { origin: { row: 2, column: 5 }, score: 42 },
  ];

  const result = scaleKeypoints(keypoints, 3);

  expect(result).toStrictEqual([{ origin: { row: 6, column: 15 }, score: 42 }]);
  expect(result).not.toBe(keypoints);
});
