import { toDegrees } from '../angles';
import { rotate } from '../points';

test('toDegrees', () => {
  expect(toDegrees(Math.PI / 2)).toBe(90);
});

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

  it.each([
    {
      message: 'test 1',
      minSurfaceAngle: -2.2983747776642183,
      mbr: [
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
      ],
      expected: [
        {
          column: 135.9532802312561,
          row: -8.15839296066575,
        },
        {
          column: 397.8714670309162,
          row: 285.94465577624067,
        },
        {
          column: 249.88133829940995,
          row: 417.7396383446765,
        },
        {
          column: -12.036848500250201,
          row: 123.63658960777008,
        },
      ],
    },
    {
      message: 'test 2',
      minSurfaceAngle: 1.7707461595061544,
      mbr: [
        {
          column: 305.783881512603,
          row: -61.77087077450796,
        },
        {
          column: -20.060636489470433,
          row: -61.77087077450796,
        },
        {
          column: -20.060636489470433,
          row: -297.98559805337857,
        },
        {
          column: 305.783881512603,
          row: -297.98559805337857,
        },
      ],
      expected: [
        {
          column: -0.19466296304150177,
          row: 311.96055003074576,
        },
        {
          column: 64.52462840058523,
          row: -7.39201882911728,
        },
        {
          column: 296.03314179088653,
          row: 39.52498886792053,
        },
        {
          column: 231.3138504272598,
          row: 358.87755772778354,
        },
      ],
    },

    {
      message: 'test 3',
      minSurfaceAngle: -Math.PI / 2,
      mbr: [
        {
          column: 0,
          row: 255,
        },
        {
          column: -244,
          row: 255,
        },
        {
          column: -244,
          row: 0,
        },
        {
          column: 0,
          row: 0,
        },
      ],
      expected: [
        {
          column: 255,
          row: 0,
        },
        {
          column: 255,
          row: 244,
        },
        {
          column: 0,
          row: 244,
        },
        {
          column: 0,
          row: 0,
        },
      ],
    },
  ])('real data ($message)', (data) => {
    const result = rotate(data.minSurfaceAngle, data.mbr);
    expect(result).toBeDeepCloseTo(data.expected);
  });
});
