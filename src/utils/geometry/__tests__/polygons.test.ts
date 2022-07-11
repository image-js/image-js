import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { getPolygonPerimeter } from '../polygons';

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
