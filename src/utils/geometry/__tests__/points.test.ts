import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { rotate } from '../points';

import { rotateTests } from './rotateTests';

expect.extend({ toBeDeepCloseTo });

describe('rotate', () => {
  it('90 degrees', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 1, row: 0 },
    ];

    const result = rotate(Math.PI / 2, points);

    expect(result).toBeDeepCloseTo([
      { column: 0, row: 0 },
      { column: 0, row: 1 },
    ]);
  });
  it('180 degrees', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 1, row: 0 },
    ];

    const result = rotate(Math.PI, points);

    expect(result).toBeDeepCloseTo([
      { column: 0, row: 0 },
      { column: -1, row: 0 },
    ]);
  });
  it('360 degrees', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 1, row: 0 },
    ];

    const result = rotate(2 * Math.PI, points);

    expect(result).toBeDeepCloseTo([
      { column: 0, row: 0 },
      { column: 1, row: 0 },
    ]);
  });
  it('-90 degrees', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 1, row: 0 },
    ];

    const result = rotate(-Math.PI / 2, points);

    expect(result).toBeDeepCloseTo([
      { column: 0, row: 0 },
      { column: 0, row: -1 },
    ]);
  });
  it('45 degrees', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 1, row: 0 },
    ];

    const result = rotate(Math.PI / 4, points);

    expect(result).toBeDeepCloseTo([
      { column: 0, row: 0 },
      { column: 1 / Math.sqrt(2), row: 1 / Math.sqrt(2) },
    ]);
  });
  it('rotate small square 45 degrees', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 1, row: 0 },
      { column: 1, row: 1 },
      { column: 0, row: 1 },
    ];

    const result = rotate(Math.PI / 4, points);

    expect(result).toBeDeepCloseTo([
      { column: 0, row: 0 },
      { column: 1 / Math.sqrt(2), row: 1 / Math.sqrt(2) },
      { column: 0, row: 2 / Math.sqrt(2) },
      { column: -1 / Math.sqrt(2), row: 1 / Math.sqrt(2) },
    ]);
  });
  it('rotate small square 90 degrees', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 1, row: 0 },
      { column: 1, row: 1 },
      { column: 0, row: 1 },
    ];

    const result = rotate(Math.PI / 2, points);
    expect(result).toBeDeepCloseTo([
      { column: 0, row: 0 },
      { column: 0, row: 1 },
      { column: -1, row: 1 },
      { column: -1, row: 0 },
    ]);
  });
  it('rotate small square 135 degrees', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 1, row: 0 },
      { column: 1, row: 1 },
      { column: 0, row: 1 },
    ];

    const result = rotate((3 * Math.PI) / 4, points);
    expect(result).toBeDeepCloseTo([
      { column: 0, row: 0 },
      { column: -1 / Math.sqrt(2), row: 1 / Math.sqrt(2) },
      { column: -2 / Math.sqrt(2), row: 0 },
      { column: -1 / Math.sqrt(2), row: -1 / Math.sqrt(2) },
    ]);
  });
  it('points should not be crossed after rotation 0', () => {
    const minSurfaceAngle = -2.2983747776642183;
    const mbr = [
      {
        column: -84.3249418924213,
        row: 106.95399925285102,
      },
      {
        column: -478.1494457678973,
        row: 106.95399925285102,
      },
      {
        column: -478.1494457678973,
        row: -91.21510941997443,
      },
      {
        column: -84.3249418924213,
        row: -91.21510941997443,
      },
    ];

    const result = rotate(minSurfaceAngle, mbr);
    console.log({ result });

    const expected = [
      {
        column: 135.9532802312561,
        row: -8.15839296066575,
      },
      {
        column: -12.036848500250201,
        row: 123.63658960777008,
      },
      {
        column: 397.8714670309162,
        row: 285.94465577624067,
      },
      {
        column: 249.88133829940995,
        row: 417.7396383446765,
      },
    ];

    expect(result).toBeDeepCloseTo(expected);
  });
  it('points should not be crossed after rotation 1', () => {
    const result = rotate(rotateTests[1].minSurfaceAngle, rotateTests[1].mbr);
    console.log({ result });

    expect(result).toBeDeepCloseTo(rotateTests[1].mbrRotated);
  });
  it.only('points should not be crossed after rotation 2', () => {
    const result = rotate(rotateTests[2].minSurfaceAngle, rotateTests[2].mbr);
    console.log({ result });

    expect(result).toBeDeepCloseTo(rotateTests[2].mbrRotated);
  });
});
