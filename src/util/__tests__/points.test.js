import { surface, perimeter } from '../points';

describe('utilities for points', function () {
  it('surface 1', function () {
    expect(
      surface([
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
      ]),
    ).toBe(1);
  });

  it('surface 4', function () {
    expect(
      surface([
        [0, 0],
        [0, 2],
        [2, 2],
        [2, 0],
      ]),
    ).toBe(4);
  });

  it('surface diamond', function () {
    expect(
      surface([
        [0, 0],
        [1, 1],
        [0, 2],
        [-1, 1],
      ]),
    ).toBe(2);
  });

  it('perimeter diamond', function () {
    expect(
      perimeter([
        [0, 0],
        [1, 1],
        [0, 2],
        [-1, 1],
      ]),
    ).toBeCloseTo(Math.sqrt(2) * 4);
  });
});
