import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { normalize } from '../points';

expect.extend({ toBeDeepCloseTo });

describe('normalize', () => {
  it('simple numbers', () => {
    const point = { column: 3, row: 4 };
    expect(normalize(point)).toStrictEqual({ column: 3 / 5, row: 4 / 5 });
  });
  it('other simple numbers', () => {
    const point = { column: 6, row: 8 };
    expect(normalize(point)).toStrictEqual({ column: 6 / 10, row: 8 / 10 });
  });
});
