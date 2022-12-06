import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { getAngle } from '../getAngle';

expect.extend({ toBeDeepCloseTo });

test.each([
  [
    '-60 degrees',
    { column: 0, row: 0 },
    { column: 1, row: -Math.sqrt(3) },
    -Math.PI / 3,
  ],
  ['-45 degrees', { column: 0, row: 0 }, { column: 1, row: -1 }, -Math.PI / 4],
  [
    '-30 degrees',
    { column: 0, row: 0 },
    { column: Math.sqrt(3), row: -1 },
    -Math.PI / 6,
  ],
  [
    '60 degrees',
    { column: 0, row: 0 },
    { column: 1, row: Math.sqrt(3) },
    Math.PI / 3,
  ],
  ['45 degrees', { column: 0, row: 0 }, { column: 1, row: 1 }, Math.PI / 4],
  [
    '30 degrees',
    { column: 0, row: 0 },
    { column: Math.sqrt(3), row: 1 },
    Math.PI / 6,
  ],
  ['180 degrees', { column: 0, row: 0 }, { column: -1, row: 0 }, Math.PI],
  ['270 degrees', { column: 0, row: 0 }, { column: 0, row: 1 }, Math.PI / 2],
  ['90 degrees', { column: 0, row: 0 }, { column: 0, row: -1 }, -Math.PI / 2],
])('getAngle (%s)', (_, point1, point2, expectedAngle) => {
  const result = getAngle(point1, point2);
  expect(result).toBeCloseTo(expectedAngle);
});
