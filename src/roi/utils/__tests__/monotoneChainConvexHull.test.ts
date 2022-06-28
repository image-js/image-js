import { monotoneChainConvexHull as mcch } from '../monotoneChainConvexHull';

describe('monotoneChainConvexHull', () => {
  it('basic square', () => {
    const result = mcch([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
    expect(result).toStrictEqual([
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
    ]);
  });

  it('mixed square', () => {
    const result = mcch([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 1],
      [1, 1],
      [0, 2],
      [1, 2],
      [1, 0],
      [2, 0],
      [1, 1],
      [2, 1],
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2],
    ]);
    expect(result).toStrictEqual([
      [0, 0],
      [0, 2],
      [2, 2],
      [2, 0],
    ]);
  });

  it('rectangle with inside points', () => {
    const result = mcch([
      [1, 1],
      [3, 0],
      [2, 1],
      [3, 2],
      [1, 2],
      [0, 2],
      [0, 0],
    ]);
    expect(result).toStrictEqual([
      [0, 0],
      [0, 2],
      [3, 2],
      [3, 0],
    ]);
  });

  it('more complex shape', () => {
    const result = mcch([
      [-1, -1],
      [0, 0],
      [0, -2],
      [1, 0],
      [1, 2],
      [4, 1],
      [0, 8],
      [3, 6],
      [2, 4],
    ]);
    expect(result).toStrictEqual([
      [-1, -1],
      [0, 8],
      [3, 6],
      [4, 1],
      [0, -2],
    ]);
  });

  it('already sorted', () => {
    const result = mcch(
      [
        [0, 0],
        [0, 2],
        [1, 1],
        [1, 2],
        [2, 1],
        [3, 0],
        [3, 2],
      ],
      { sorted: true },
    );
    expect(result).toStrictEqual([
      [0, 0],
      [0, 2],
      [3, 2],
      [3, 0],
    ]);
  });
});
