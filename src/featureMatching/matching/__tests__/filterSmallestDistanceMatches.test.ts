import type { Match } from '../bruteForceMatch.js';
import { filterSmallestDistanceMatches } from '../filterSmallestDistanceMatches.js';

test('3 matches', () => {
  const matches: Match[] = [
    { sourceIndex: 0, destinationIndex: 0, distance: 1 },
    { sourceIndex: 1, destinationIndex: 2, distance: 3 },
    { sourceIndex: 2, destinationIndex: 0, distance: 5 },
  ];

  const result = filterSmallestDistanceMatches(matches);
  expect(result).toStrictEqual([
    { sourceIndex: 0, destinationIndex: 0, distance: 1 },
    { sourceIndex: 1, destinationIndex: 2, distance: 3 },
  ]);
});

test('7 matches', () => {
  const matches: Match[] = [
    { sourceIndex: 14, destinationIndex: 0, distance: 1 },
    { sourceIndex: 1, destinationIndex: 0, distance: 2 },
    { sourceIndex: 9, destinationIndex: 0, distance: 3 },
    { sourceIndex: 5, destinationIndex: 0, distance: 4 },
    { sourceIndex: 2, destinationIndex: 0, distance: 5 },
    { sourceIndex: 10, destinationIndex: 0, distance: 6 },
    { sourceIndex: 3, destinationIndex: 0, distance: 7 },
  ];

  expect(filterSmallestDistanceMatches(matches)).toStrictEqual([
    { sourceIndex: 14, destinationIndex: 0, distance: 1 },
  ]);
});
