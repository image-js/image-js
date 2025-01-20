import { getMbrAngle } from '../getMbrAngle.js';

test.each([
  [
    '30 degrees',
    [
      { column: 0, row: 0 },
      { column: Math.sqrt(3), row: -1 },
      { column: 1, row: -Math.sqrt(3) },
      { column: -1, row: -1 },
    ],
    30,
  ],
  [
    '-45 degrees, wider than long',
    [
      { column: 0, row: 0 },
      { column: 1, row: -1 },
      { column: -2, row: -4 },
      { column: -3, row: -3 },
    ],
    -45,
  ],
  [
    '45 degrees, longer than wide',
    [
      { column: 0, row: 0 },
      { column: 3, row: -3 },
      { column: 2, row: -4 },
      { column: -1, row: -1 },
    ],
    45,
  ],
  [
    '0 degrees, wider than high',
    [
      { column: 0, row: 0 },
      { column: 3, row: 0 },
      { column: 3, row: 1 },
      { column: 0, row: 1 },
    ],
    0,
  ],
  [
    '0 degrees, higher than wide',
    [
      { column: 0, row: 0 },
      { column: 1, row: 0 },
      { column: 1, row: 3 },
      { column: 0, row: 3 },
    ],
    0,
  ],
  [
    '0 degrees',
    [
      { column: 5.639498510073562e-14, row: 924 },
      { column: -1.8369701987210282e-16, row: 2.220446049250313e-15 },
      { column: 1136, row: -6.733949214231935e-14 },
      { column: 1136, row: 923.9999999999999 },
    ],
    0,
  ],
])('getMbrAngle (%s)', (_, inputPoints, expectedAngle) => {
  const result = getMbrAngle(inputPoints);

  expect(result).toBeCloseTo(expectedAngle);
});
