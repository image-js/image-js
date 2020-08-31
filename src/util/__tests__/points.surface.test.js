import { surface } from '../points';

describe('utilities for points: surface', function () {
  it('square 1', function () {
    expect(
      surface([
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
      ]),
    ).toBe(1);
  });

  it('square 4', function () {
    expect(
      surface([
        [0, 0],
        [0, 2],
        [2, 2],
        [2, 0],
      ]),
    ).toBe(4);
  });

  it('diamond', function () {
    expect(
      surface([
        [0, 0],
        [1, 1],
        [0, 2],
        [-1, 1],
      ]),
    ).toBe(2);
  });

  it('line', function () {
    expect(
      surface([
        [0, 0],
        [1, 1],
      ]),
    ).toBe(0);
  });

  it('P shape', () => {
    expect(
      surface([
        [0, 0],
        [0, 4],
        [2, 4],
        [2, 2],
        [0, 2],
      ]),
    ).toBe(4);
  });

  it('complex shape', () => {
    /*
    11000
    11000
    11000
    11111
    01111
    */
    expect(
      surface([
        [0, 1],
        [0, 4],
        [1, 4],
        [1, 1],
        [4, 1],
        [4, 0],
        [1, 0],
      ]),
    ).toBe(6.5);
  });
});
