import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import oneRoi from 'test/oneRoi';

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
        min: 2.8284,
        minLine: [
          [1, 3],
          [3, 1],
        ],
        max: 3.1623,
        maxLine: [
          [0, 1],
          [3, 2],
        ],
        aspectRatio: 0.8944,
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
        min: 2,
        minLine: [
          [0, 0],
          [2, 0],
        ],
        max: 4.4721,
        maxLine: [
          [0, 0],
          [2, 4],
        ],
        aspectRatio: 0.4472,
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
        min: 4.2426,
        minLine: [
          [3, 5],
          [0, 2],
        ],
        max: 5.099,
        maxLine: [
          [0, 2],
          [5, 3],
        ],
        aspectRatio: 0.8321,
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
        min: 5,
        minLine: [
          [0, 5],
          [0, 0],
        ],
        max: 6.7082,
        maxLine: [
          [0, 0],
          [6, 3],
        ],
        aspectRatio: 0.7453,
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

    const result = roi.feretDiameters;
    expect(result).toMatchCloseTo(
      {
        min: 2.8284,
        minLine: [
          [2, 2],
          [0, 0],
        ],
        max: 4.242,
        maxLine: [
          [0, 3],
          [3, 0],
        ],
        aspectRatio: 0.6667,
      },
      3,
    );
  });
});
