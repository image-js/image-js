import type { Match } from '../bruteForceMatch.js';
import { filterEuclideanDistance } from '../filterEuclideanDistance.js';

test('3 matches', () => {
  const matches: Match[] = [
    { sourceIndex: 0, destinationIndex: 0, distance: 1 },
    { sourceIndex: 1, destinationIndex: 2, distance: 3 },
    { sourceIndex: 2, destinationIndex: 0, distance: 5 },
    { sourceIndex: 3, destinationIndex: 2, distance: 5 },
  ];

  const sourceKeypoints = [
    { origin: { column: 0, row: 0 }, score: 0 },
    { origin: { column: 1, row: 3 }, score: 0 },
    { origin: { column: 5, row: 6 }, score: 0 },
    { origin: { column: 1, row: 1 }, score: 0 },
  ];

  const destinationKeypoints = [
    { origin: { column: 0, row: 0 }, score: 0 },
    { origin: { column: 0, row: 0 }, score: 0 },
    { origin: { column: 0, row: 0 }, score: 0 },
    { origin: { column: 0, row: 0 }, score: 0 },
  ];

  const result = filterEuclideanDistance(
    matches,
    sourceKeypoints,
    destinationKeypoints,
  );

  expect(result).toStrictEqual([
    { sourceIndex: 0, destinationIndex: 0, distance: 1 },
    { sourceIndex: 3, destinationIndex: 2, distance: 5 },
  ]);
});
