import oneRoi from 'test/oneRoi';
import binary from 'test/binary';

import feretDiameters from '../feretDiameters';

import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('Feret diameters', function () {
  it('roi 3x3', function () {
    let roi = oneRoi`
        010
        111
        010
      `;
    expect(roi.feretDiameters).toMatchCloseTo(
      {
        min: 1.41421,
        minLine: [
          [1, 2],
          [0, 1],
        ],
        max: 2,
        maxLine: [
          [0, 1],
          [2, 1],
        ],
      },
      3,
    );
  });

  it('roi 4x4', function () {
    let roi = oneRoi`
        0110
        0110
        0110
        0110
      `;

    expect(roi.feretDiameters).toMatchCloseTo(
      {
        min: 1,
        minLine: [
          [0, 0],
          [1, 0],
        ],
        max: 3.1622,
        maxLine: [
          [0, 0],
          [1, 3],
        ],
      },
      3,
    );
  });

  it('roi 5x5', function () {
    let roi = oneRoi`
        00100
        00100
        11111
        00100
        00100
      `;

    expect(roi.feretDiameters).toMatchCloseTo(
      {
        min: 2.8284,
        minLine: [
          [2, 4],
          [0, 2],
        ],
        max: 4,
        maxLine: [
          [0, 2],
          [4, 2],
        ],
      },
      3,
    );
  });

  it('triangle 5x5', function () {
    let roi = oneRoi`
      100000
      111000
      111111
      111000
      100000
    `;
    expect(roi.feretDiameters).toMatchCloseTo(
      {
        min: 3.7139,
        minLine: [
          [1.3793, 0.5517],
          [0, 4],
        ],
        max: 5.385164807134504,
        maxLine: [
          [0, 0],
          [5, 2],
        ],
      },
      3,
    );
  });

  it('square triangle 3x3', function () {
    let roi = oneRoi`
        111
        100
        100
      `;

    const result = feretDiameters.call(roi);

    expect(result).toMatchCloseTo(
      {
        min: 1.4142,
        minLine: [
          [1, 1],
          [0, 0],
        ],
        max: 2.8284,
        maxLine: [
          [0, 2],
          [2, 0],
        ],
      },
      3,
    );
  });
});
