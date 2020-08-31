import { perimeter } from '../points';

describe('utilities for points', function () {
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

  it('perimeter line', function () {
    expect(
      perimeter([
        [0, 0],
        [0, 1],
      ]),
    ).toBeCloseTo(2);
  });
});
