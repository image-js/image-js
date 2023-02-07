import { OrientedFastKeypoint } from '../../getOrientedFastKeypoints';
import { getDistanceMatrix } from '../getDistanceMatrix';

test('3x3 empty image', () => {
  const keypoints: OrientedFastKeypoint[] = [
    { origin: { row: 0, column: 0 }, angle: 0, score: 3 },
    { origin: { row: 1, column: 0 }, angle: 0, score: 5 },
    { origin: { row: 0, column: 2 }, angle: 0, score: 6 },
  ];
  const result = getDistanceMatrix(keypoints);

  let array = result.map((line) => Array.from(line));

  expect(array).toStrictEqual([
    [0, 1, 4],
    [1, 0, 5],
    [4, 5, 0],
  ]);
});
