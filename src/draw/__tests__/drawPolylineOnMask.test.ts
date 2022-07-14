import { Mask } from '../../Mask';
import { drawPolylineOnMask } from '../drawPolylineOnMask';

describe('drawPolyline on Mask', () => {
  it('3x3 mask', () => {
    const image = new Mask(3, 3);
    const points = [
      { row: 1, column: 0 },
      { row: 2, column: 1 },
    ];
    const result = image.drawPolyline(points);
    expect(result).toMatchMaskData([
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
    ]);
    expect(result).not.toBe(image);
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
      { row: 0, column: 1 },
    ];
    const result = mask.drawPolyline(points, {
      out: mask,
    });

    expect(result).toMatchMaskData([
      [1, 1, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]);
    expect(result).toBe(mask);
  });
  it('out to other mask', () => {
    const out = new Mask(5, 5);
    const mask = testUtils.createMask([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      { row: 3, column: 1 },
      { row: 3, column: 4 },
    ];
    const result = mask.drawPolyline(points, {
      out,
    });

    expect(result).toMatchMaskData([
      [1, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
    ]);
    expect(result).toBe(out);
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
    ];
    const result = mask.drawPolyline(points);

    expect(result).toMatchMaskData([
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 1, 0],
    ]);
    expect(result).not.toBe(mask);
  });
  it('default options', () => {
    const mask = testUtils.createMask([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    const points = [
      { row: 0, column: 0 },
      { row: mask.height, column: mask.width },
    ];
    const result = drawPolylineOnMask(mask, points);

    expect(result).toMatchMaskData([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  });
  it('different origin', () => {
    const mask = testUtils.createMask([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 1, column: 0 },
      { row: 1, column: 1 },
    ];
    const result = mask.drawPolyline(points, {
      origin: { column: 1, row: 0 },
    });
    expect(result).toMatchMaskData([
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    expect(result).not.toBe(mask);
  });
  it('different origin, outside of mask', () => {
    const mask = testUtils.createMask([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      { row: 3, column: 1 },
      { row: 3, column: 4 },
    ];
    const result = mask.drawPolyline(points, {
      origin: { column: 0, row: 2 },
    });
    expect(result).toMatchMaskData([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
    ]);
    expect(result).not.toBe(mask);
  });
});
