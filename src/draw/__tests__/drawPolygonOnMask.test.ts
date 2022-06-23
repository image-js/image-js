import { Mask } from '../../Mask';

describe('drawPolygon on Mask', () => {
  it('3x3 mask', () => {
    const mask = testUtils.createMask([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 1, column: 1 },
    ];
    const result = mask.drawPolygon(points);

    expect(result).toMatchMaskData([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]);
    expect(result).not.toBe(mask);
  });
  it('out parameter set to self', () => {
    const mask = testUtils.createMask([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 1, column: 1 },
      { row: 2, column: 0 },
    ];
    const result = mask.drawPolygon(points, {
      out: mask,
    });

    expect(result).toMatchMaskData([
      [1, 0, 0],
      [1, 1, 0],
      [1, 0, 0],
    ]);
    expect(result).toBe(mask);
  });
  it('out to other image', () => {
    const out = new Mask(3, 2);
    const mask = testUtils.createMask([
      [0, 0, 0],
      [0, 0, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 1, column: 1 },
      { row: 0, column: 2 },
    ];
    const result = mask.drawPolygon(points, {
      out,
    });

    expect(result).toMatchMaskData([
      [1, 1, 1],
      [0, 1, 0],
    ]);
    expect(result).toBe(out);
    expect(result).not.toBe(mask);
  });
  it('drawPolygon with no points', () => {
    const mask = testUtils.createRgbImage([
      [1, 1, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]);
    const result = mask.drawPolygon([], {
      strokeColor: [255, 0, 0],
    });

    expect(result).toMatchImage(mask);
    expect(result).not.toBe(mask);
  });
  it('triangle not filled', () => {
    const mask = testUtils.createMask([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 3, column: 3 },
      { row: 3, column: 0 },
    ];
    const result = mask.drawPolygon(points);
    expect(result).toMatchMaskData([
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [1, 0, 1, 0],
      [1, 1, 1, 1],
    ]);
    expect(result).not.toBe(mask);
  });
  it('triangle filled', () => {
    const mask = testUtils.createMask([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 3, column: 3 },
      { row: 3, column: 0 },
    ];
    const result = mask.drawPolygon(points, {
      filled: true,
    });

    expect(result).toMatchMaskData([
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [1, 1, 1, 0],
      [1, 1, 1, 1],
    ]);
    expect(result).not.toBe(mask);
  });
  it('rectangle filled', () => {
    const mask = testUtils.createMask([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 1],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 3, column: 0 },
      { row: 3, column: 2 },
      { row: 0, column: 2 },
    ];
    const result = mask.drawPolygon(points, {
      filled: true,
    });

    expect(result).toMatchMaskData([
      [1, 1, 1, 0],
      [1, 1, 1, 0],
      [1, 1, 1, 0],
      [1, 1, 1, 1],
    ]);
    expect(result).not.toBe(mask);
  });
  it('should handle duplicate points', () => {
    const mask = testUtils.createMask([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 0, column: 0 },
      { row: 3, column: 0 },
      { row: 3, column: 2 },
      { row: 3, column: 2 },
      { row: 0, column: 2 },
    ];
    const result = mask.drawPolygon(points, {
      filled: true,
    });

    expect(result).toMatchMaskData([
      [1, 1, 1, 0],
      [1, 1, 1, 0],
      [1, 1, 1, 0],
      [1, 1, 1, 0],
    ]);
    expect(result).not.toBe(mask);
  });
});
