import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { getLineLength } from '../lines';

expect.extend({ toBeDeepCloseTo });

describe('lines (getLineLength)', () => {
  it('length zero', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 0, row: 0 },
    ];

    expect(getLineLength(points[0], points[1])).toBe(0);
  });
  it('horizontal line', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 10, row: 0 },
    ];

    expect(getLineLength(points[0], points[1])).toBe(10);
  });
  it('tilted line', () => {
    const points = [
      { column: 0, row: 0 },
      { column: 1, row: 1 },
    ];

    expect(getLineLength(points[0], points[1])).toBeCloseTo(Math.sqrt(2));
  });
});
