import { Image } from 'test/common';

describe('check the warping 4 points transform', function () {
  it('resize without rotation', function () {
    const image = new Image(3, 3, [1, 2, 3, 4, 5, 6, 7, 8, 9], {
      kind: 'GREY'
    });

    const result = image.warpingFourPoints([
      [0, 0],
      [2, 0],
      [1, 2],
      [0, 2]
    ]);
    expect(result.width).not.toBeLessThan(2);
    expect(result.height).not.toBeLessThan(2);
    expect(result.width).not.toBeGreaterThan(3);
    expect(result.height).not.toBeGreaterThan(3);
  });

  it('resize without rotation 2', function () {
    const image = new Image(
      4,
      4,
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      { kind: 'GREY' }
    );

    const result = image.warpingFourPoints([
      [0, 0],
      [3, 0],
      [2, 1],
      [0, 1]
    ]);
    expect(result.width).not.toBeLessThan(3);
    expect(result.height).not.toBeLessThan(1);
    expect(result.width).not.toBeGreaterThan(4);
    expect(result.height).not.toBeGreaterThan(2);
  });
});
