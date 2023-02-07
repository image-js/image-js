import { OrientedFastKeypoint } from '../../getOrientedFastKeypoints';
import { getKeypointsInRadius } from '../getKeypointsInRadius';

test('3x3 empty image', () => {
  const keypoints: OrientedFastKeypoint[] = [
    { origin: { row: 0, column: 0 }, angle: 0, score: 3 },
    { origin: { row: 1, column: 0 }, angle: 0, score: 5 },
    { origin: { row: 0, column: 2 }, angle: 0, score: 6 },
  ];
  const result = getKeypointsInRadius(keypoints, 1);

  expect(result).toStrictEqual([[1], [0], []]);
});
