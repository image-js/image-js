import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { getPolygonArea, getPolygonPerimeter } from '../polygons';

expect.extend({ toBeDeepCloseTo });

describe('polygons (getPolygonPerimeter)', () => {
  it('perimeter zero', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 0, row: 0 },
    ];

    expect(getPolygonPerimeter(points)).toBe(0);
  });
  it('square', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 1, row: 0 },
      { column: 1, row: 1 },
      { column: 0, row: 1 },
    ];

    expect(getPolygonPerimeter(points)).toBe(4);
  });
});
describe('polygons (getPolygonArea)', () => {
  it('area zero', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 0, row: 0 },
      { column: 0, row: 0 },
      { column: 0, row: 0 },
    ];

    expect(getPolygonArea(points)).toBe(0);
  });
  it('square', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 1, row: 0 },
      { column: 1, row: 1 },
      { column: 0, row: 1 },
    ];

    expect(getPolygonArea(points)).toBe(1);
  });
  it('rectangle', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 3, row: 0 },
      { column: 3, row: 4 },
      { column: 0, row: 4 },
    ];

    expect(getPolygonArea(points)).toBe(12);
  });
  it('square with negative values', () => {
    const points = [
      { column: -1, row: -1 },
      { column: 1, row: -1 },
      { column: 1, row: 1 },
      { column: -1, row: 1 },
    ];

    expect(getPolygonArea(points)).toBe(4);
  });
  it('triangle', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 3, row: -4 },
      { column: 6, row: 0 },
    ];

    expect(getPolygonArea(points)).toBe(12);
  });
});
