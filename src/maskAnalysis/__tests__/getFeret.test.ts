import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('getFeret', () => {
  it.only('3x3 mask', () => {
    let mask = testUtils.createMask(`
        0 1 0
        1 1 1
        0 1 0
      `);
    const result = mask.getFeret();
    console.log({ result });
    console.log({
      minPoints: result.minDiameter.points,
      maxPoints: result.maxDiameter.points,
    });
    expect(result).toBeDeepCloseTo(
      {
        minDiameter: {
          length: 2.8284,
          angle: -45,
          points: [
            { column: 1, row: 3 },
            { column: 3, row: 1 },
          ],
        },
        maxDiameter: {
          length: 3.1623,
          points: [
            { column: 0, row: 1 },
            { column: 3, row: 2 },
          ],
        },
        aspectRatio: 0.8944,
      },
      3,
    );
  });

  it('mask 4x4', () => {
    let mask = testUtils.createMask(`
        0 1 1 0
        0 1 1 0
        0 1 1 0
        0 1 1 0
      `);

    const result = mask.getFeret();
    expect(result).toMatchCloseTo(
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

  it('mask 5x5', () => {
    let mask = testUtils.createMask(`
        00100
        00100
        11111
        00100
        00100
      `);

    const result = mask.getFeret();
    expect(result).toMatchCloseTo(
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

  it('triangle 5x5', () => {
    let mask = testUtils.createMask(`
      100000
      111000
      111111
      111000
      100000
    `);

    const result = mask.getFeret();
    expect(result).toMatchCloseTo(
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

  it('square triangle 3x3', () => {
    let mask = testUtils.createMask(`
        111
        100
        100
      `);

    const result = mask.getFeret();
    expect(result).toMatchCloseTo(
      {
        min: 2.8284,
        minLine: [
          [2, 2],
          [0, 0],
        ],
        max: 4.2426,
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
