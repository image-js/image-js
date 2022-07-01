import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { getMbrFromPoints } from '../getMbrFromPoints';

expect.extend({ toBeDeepCloseTo });

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
      { column: 0, row: 0 },
      { column: 10, row: 0 },
      { column: 10, row: -10 },
      { column: 0, row: -10 },
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
      { column: 7, row: 3 },
      { column: 4, row: 6 },
      { column: 2, row: 4 },
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
    [],
  ],
])('getMbrFromPoints (%s)', (_, inputPoints, expectedPoints) => {
  const result = getMbrFromPoints(inputPoints);
  expect(result).toBeDeepCloseTo(expectedPoints);
});
