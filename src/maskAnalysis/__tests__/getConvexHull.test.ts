import { getConvexHull } from '../getConvexHull';

describe('getConvexHull', () => {
  it('cross', () => {
    const mask = testUtils.createMask([
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]);

    const convexHull = getConvexHull(mask);
    expect(convexHull).toStrictEqual([
      { column: 0, row: 1 },
      { column: 1, row: 2 },
      { column: 2, row: 1 },
      { column: 1, row: 0 },
    ]);
  });

  it('small triangle', () => {
    const mask = testUtils.createMask([
      [0, 0, 1],
      [0, 1, 1],
      [1, 1, 1],
    ]);

    const convexHull = getConvexHull(mask);
    expect(convexHull).toStrictEqual([
      { column: 0, row: 2 },
      { column: 2, row: 2 },
      { column: 2, row: 0 },
    ]);
  });
  it('1 pixel ROI', () => {
    const mask = testUtils.createMask([
      [0, 0, 0],
      [0, 0, 1],
      [0, 0, 0],
    ]);

    const convexHull = getConvexHull(mask);
    expect(convexHull).toStrictEqual([]);
  });
  it('2 pixels ROI', () => {
    const mask = testUtils.createMask([
      [0, 0, 0],
      [0, 1, 1],
      [0, 0, 0],
    ]);

    const convexHull = getConvexHull(mask);
    expect(convexHull).toStrictEqual([
      { column: 1, row: 1 },
      { column: 2, row: 1 },
    ]);
  });
  it('5x5 cross', () => {
    const mask = testUtils.createMask([
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ]);

    const convexHull = getConvexHull(mask);
    expect(convexHull).toStrictEqual([
      { column: 0, row: 2 },
      { column: 2, row: 4 },
      { column: 4, row: 2 },
      { column: 2, row: 0 },
    ]);
  });
  it('random shape', () => {
    const mask = testUtils.createMask([
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 1, 1],
      [0, 1, 0, 0, 0],
      [1, 0, 0, 0, 0],
    ]);

    const convexHull = getConvexHull(mask);
    expect(convexHull).toStrictEqual([
      { column: 0, row: 4 },
      { column: 4, row: 2 },
      { column: 2, row: 0 },
    ]);
  });
});
