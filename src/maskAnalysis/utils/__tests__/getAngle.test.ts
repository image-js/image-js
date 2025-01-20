import { getAngle, getClockwiseAngle } from '../getAngle.js';

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

test.each([
  [
    '60 degrees',
    { column: 0, row: 0 },
    { column: 1, row: -Math.sqrt(3) },
    Math.PI / 3,
  ],
  ['45 degrees', { column: 0, row: 0 }, { column: 1, row: -1 }, Math.PI / 4],
  [
    '30 degrees',
    { column: 0, row: 0 },
    { column: Math.sqrt(3), row: -1 },
    Math.PI / 6,
  ],
  [
    '-60 degrees',
    { column: 0, row: 0 },
    { column: 1, row: Math.sqrt(3) },
    -Math.PI / 3,
  ],
  ['-45 degrees', { column: 0, row: 0 }, { column: 1, row: 1 }, -Math.PI / 4],
  [
    '-30 degrees',
    { column: 0, row: 0 },
    { column: Math.sqrt(3), row: 1 },
    -Math.PI / 6,
  ],
  ['180 degrees', { column: 0, row: 0 }, { column: -1, row: 0 }, Math.PI],
  ['270 degrees', { column: 0, row: 0 }, { column: 0, row: 1 }, -Math.PI / 2],
  ['90 degrees', { column: 0, row: 0 }, { column: 0, row: -1 }, Math.PI / 2],
  [
    '90 degrees, origin not zero',
    { column: 1, row: 4 },
    { column: 1, row: 3 },
    Math.PI / 2,
  ],
  [
    '45 degrees, origin not zero',
    { column: 4, row: 5 },
    { column: 5, row: 4 },
    Math.PI / 4,
  ],
])('getClockwiseAngle (%s)', (_, point1, point2, expectedAngle) => {
  const result = getClockwiseAngle(point1, point2);
  expect(result).toBeCloseTo(expectedAngle);
});
