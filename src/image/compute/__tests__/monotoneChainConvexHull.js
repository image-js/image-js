import binary from 'test/binary';

describe('Monotone Chain Convex Hull', function () {
  it('should return the convex hull', function () {
    let image = binary`
        00000000
        00011000
        00011000
        00111111
        00111111
        00011000
        00011000
        00000000
      `;
    expect(image.monotoneChainConvexHull()).toStrictEqual([
      [2, 3],
      [2, 5],
      [3, 7],
      [5, 7],
      [8, 5],
      [8, 3],
      [5, 1],
      [3, 1],
    ]);
  });

  it('should return the convex hull for one point', function () {
    let image = binary`
        10000000
      `;

    expect(image.monotoneChainConvexHull()).toStrictEqual([
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
    ]);
  });

  it('should return the convex hull for two points', function () {
    let image = binary`
        1
        1
      `;

    expect(image.monotoneChainConvexHull()).toStrictEqual([
      [0, 0],
      [0, 2],
      [1, 2],
      [1, 0],
    ]);
  });
});
