import { expect, test } from 'vitest';

import type { Match } from '../../matching/bruteForceMatch.js';
import { sortByDestSource, sortBySourceDest } from '../sortBySourceDest.js';

test('should sort by source then dest', () => {
  const matches: Match[] = [
    { sourceIndex: 9, destinationIndex: 3, distance: 1 },
    { sourceIndex: 1, destinationIndex: 14, distance: 3 },
    { sourceIndex: 7, destinationIndex: 3, distance: 5 },
    { sourceIndex: 9, destinationIndex: 4, distance: 1 },
    { sourceIndex: 1, destinationIndex: 2, distance: 3 },
    { sourceIndex: 9, destinationIndex: 10, distance: 5 },
  ];

  const result = sortBySourceDest(matches);

  expect(result).toStrictEqual([
    { sourceIndex: 1, destinationIndex: 2, distance: 3 },
    { sourceIndex: 1, destinationIndex: 14, distance: 3 },
    { sourceIndex: 7, destinationIndex: 3, distance: 5 },
    { sourceIndex: 9, destinationIndex: 3, distance: 1 },
    { sourceIndex: 9, destinationIndex: 4, distance: 1 },
    { sourceIndex: 9, destinationIndex: 10, distance: 5 },
  ]);
});

test('should sort by dest then source', () => {
  const matches: Match[] = [
    { sourceIndex: 9, destinationIndex: 3, distance: 1 },
    { sourceIndex: 1, destinationIndex: 14, distance: 3 },
    { sourceIndex: 7, destinationIndex: 3, distance: 5 },
    { sourceIndex: 9, destinationIndex: 4, distance: 1 },
    { sourceIndex: 1, destinationIndex: 2, distance: 3 },
    { sourceIndex: 9, destinationIndex: 10, distance: 5 },
  ];

  const result = sortByDestSource(matches);

  expect(result).toStrictEqual([
    { sourceIndex: 1, destinationIndex: 2, distance: 3 },
    { sourceIndex: 7, destinationIndex: 3, distance: 5 },
    { sourceIndex: 9, destinationIndex: 3, distance: 1 },
    { sourceIndex: 9, destinationIndex: 4, distance: 1 },
    { sourceIndex: 9, destinationIndex: 10, distance: 5 },
    { sourceIndex: 1, destinationIndex: 14, distance: 3 },
  ]);
});
