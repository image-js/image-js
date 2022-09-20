import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('getFeret', () => {
  it('empty mask', () => {
    let mask = testUtils.createMask(`0 0 0`);
    const result = mask.getFeret();
    expect(result).toBeDeepCloseTo(
      {
        minDiameter: {
          length: 0,
          angle: 0,
          points: [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
        },
        maxDiameter: {
          length: 0,
          angle: 0,
          points: [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
        },
        aspectRatio: 1,
      },
      3,
    );
  });
  it('mask with only 1 pixel', () => {
    let mask = testUtils.createMask(`0 1 0`);
    const result = mask.getFeret();
    console.log({ result });
    console.log({
      minPoints: result.minDiameter.points,
      maxPoints: result.maxDiameter.points,
    });
    expect(result).toBeDeepCloseTo(
      {
        minDiameter: {
          length: 1,
          angle: 90,
          points: [
            { column: 1, row: 3 },
            { column: 3, row: 1 },
          ],
        },
        maxDiameter: {
          length: 1.414,
          points: [
            { column: 1, row: 0 },
            { column: 2, row: 1 },
          ],
        },
        aspectRatio: 0.707,
      },
      3,
    );
  });
  it('mask 3x3', () => {
    let mask = testUtils.createMask(`
        0 1 0
        1 1 1
        0 1 0
      `);
    const result = mask.getFeret();
    expect(result).toBeDeepCloseTo(
      {
        minDiameter: {
          length: 2.8284,
          angle: 45,
          points: [
            { column: 0, row: 2 },
            { column: 3, row: 1 },
          ],
        },
        maxDiameter: {
          length: 3.1623,
          angle: 18.43,
          points: [
            { column: 0, row: 1 },
            { column: 3, row: 2 },
          ],
        },
        aspectRatio: 0.8944,
      },
      2,
    );
  });

  it.only('mask 4x4', () => {
    let mask = testUtils.createMask(`
        0 1 1 0
        0 1 1 0
        0 1 1 0
        0 1 1 0
      `);

    const result = mask.getFeret();

    expect(result).toBeDeepCloseTo(
      {
        minDiameter: {
          length: 2,
          angle: 90,
          points: [
            { column: 1, row: 0 },
            { column: 3, row: 0 },
          ],
        },
        maxDiameter: {
          length: 4.4721,
          angle: 63.43,
          points: [
            { column: 1, row: 0 },
            { column: 3, row: 4 },
          ],
        },
        aspectRatio: 0.4472,
      },
      2,
    );
  });

  it('mask 5x5', () => {
    let mask = testUtils.createMask(`
        0 0 1 0 0
        0 0 1 0 0
        1 1 1 1 1
        0 0 1 0 0
        0 0 1 0 0
      `);

    const result = mask.getFeret();
    console.log({
      minPoints: result.minDiameter.points,
      maxPoints: result.maxDiameter.points,
    });
    expect(result).toBeDeepCloseTo(
      {
        minDiameter: {
          length: 4.2426,
          angle: 0,
          points: [
            { column: 3, row: 5 },
            { column: 0, row: 2 },
          ],
        },
        maxDiameter: {
          length: 5.099,
          angle: 0,
          points: [
            { column: 0, row: 2 },
            { column: 5, row: 3 },
          ],
        },
        aspectRatio: 0.4472,
      },
      2,
    );
  });

  it('triangle 5x5', () => {
    let mask = testUtils.createMask(`
      1 0 0 0 0 0
      1 1 1 0 0 0
      1 1 1 1 1 1
      1 1 1 0 0 0
      1 0 0 0 0 0
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
        1 1 1
        1 0 0
        1 0 0
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
