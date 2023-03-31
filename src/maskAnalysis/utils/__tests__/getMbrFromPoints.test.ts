import { getMbrFromPoints } from '../getMbrFromPoints';

test.each([
  [
    'one point',
    [{ column: 3, row: 3 }],
    [
      { column: 3, row: 3 },
      { column: 3, row: 3 },
      { column: 3, row: 3 },
      { column: 3, row: 3 },
    ],
  ],
  [
    'vertical line',
    [
      { column: 3, row: 3 },
      { column: 3, row: 5 },
    ],
    [
      { column: 3, row: 5 },
      { column: 3, row: 3 },
      { column: 3, row: 3 },
      { column: 3, row: 5 },
    ],
  ],
  [
    'skewed line',
    [
      { column: 3, row: 3 },
      { column: 5, row: 5 },
    ],
    [
      { column: 5, row: 5 },
      { column: 3, row: 3 },
      { column: 3, row: 3 },
      { column: 5, row: 5 },
    ],
  ],
  [
    'triangle',
    [
      { column: 0, row: 0 },
      { column: 1, row: 0 },
      { column: 0, row: 1 },
    ],
    [
      { column: 1, row: 0 },
      { column: 0, row: 0 },
      { column: 0, row: 1 },
      { column: 1, row: 1 },
    ],
  ],
  [
    'polygon',
    [
      { column: 2, row: 0 },
      { column: 4, row: 0 },
      { column: 6, row: 1 },
      { column: 7, row: 3 },
      { column: 3, row: 3 },
      { column: 0, row: 2 },
    ],
    [
      { column: 7, row: 0 },
      { column: 0, row: 0 },
      { column: 0, row: 3 },
      { column: 7, row: 3 },
    ],
  ],
  [
    'negative values',
    [
      { column: 0, row: 0 },
      { column: 10, row: 0 },
      { column: 10, row: -10 },
      { column: 0, row: -10 },
    ],
    [
      { column: 10, row: 0 },
      { column: 0, row: 0 },
      { column: 0, row: -10 },
      { column: 10, row: -10 },
    ],
  ],
  [
    'skewed rectangle',
    [
      { column: 5, row: 1 },
      { column: 7, row: 3 },
      { column: 4, row: 6 },
      { column: 2, row: 4 },
    ],
    [
      { column: 5, row: 1 },
      { column: 2, row: 4 },
      { column: 4, row: 6 },
      { column: 7, row: 3 },
    ],
  ],
  [
    'complex test',
    [
      {
        column: 0,
        row: 189,
      },
      {
        column: 0,
        row: 192,
      },
      {
        column: 87,
        row: 312,
      },
      {
        column: 89,
        row: 313,
      },
      {
        column: 94,
        row: 313,
      },
      {
        column: 98,
        row: 311,
      },
      {
        column: 102,
        row: 308,
      },
      {
        column: 315,
        row: 135,
      },
      {
        column: 316,
        row: 134,
      },
      {
        column: 316,
        row: 133,
      },
      {
        column: 314,
        row: 123,
      },
      {
        column: 223,
        row: 16,
      },
      {
        column: 209,
        row: 0,
      },
      {
        column: 208,
        row: 0,
      },
      {
        column: 205,
        row: 2,
      },
      {
        column: 2,
        row: 187,
      },
    ],
    [
      { column: 208.53593512417638, row: -1.0071971616827256 },
      { column: 320.3418651799291, row: 130.45691839837812 },
      { column: 95.34358844399394, row: 321.81059300557524 },
      { column: -16.46234161175873, row: 190.34647744551438 },
    ],
  ],
])('getMbrFromPoints (%s)', (_, inputPoints, expectedPoints) => {
  const result = getMbrFromPoints(inputPoints).points;
  expect(result).toBeDeepCloseTo(expectedPoints);
});
