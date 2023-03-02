import { Match } from '../../matching/bruteForceMatch';
import { sortByDistance } from '../sortByDistance';

it('should sort by source then dest', () => {
  const matches: Match[] = [
    { sourceIndex: 9, destinationIndex: 3, distance: 1 },
    { sourceIndex: 1, destinationIndex: 14, distance: 2 },
    { sourceIndex: 7, destinationIndex: 3, distance: 4 },
    { sourceIndex: 9, destinationIndex: 4, distance: 6 },
    { sourceIndex: 1, destinationIndex: 2, distance: 3 },
    { sourceIndex: 9, destinationIndex: 10, distance: 5 },
  ];

  const result = sortByDistance(matches);
  expect(result).toStrictEqual([
    { sourceIndex: 9, destinationIndex: 3, distance: 1 },
    { sourceIndex: 1, destinationIndex: 14, distance: 2 },
    { sourceIndex: 1, destinationIndex: 2, distance: 3 },
    { sourceIndex: 7, destinationIndex: 3, distance: 4 },
    { sourceIndex: 9, destinationIndex: 10, distance: 5 },
    { sourceIndex: 9, destinationIndex: 4, distance: 6 },
  ]);
});
