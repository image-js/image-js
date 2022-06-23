import { IJS } from '../../IJS';

describe('drawPolyline on IJS', () => {
  it('RGB image', () => {
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    const points = [
      { row: 1, column: 0 },
      { row: 2, column: 1 },
    ];
    const result = image.drawPolyline(points, { strokeColor: [255, 0, 0] });
    expect(result).toMatchImageData([
      [100, 150, 200, 100, 150, 0],
      [255, 0, 0, 3, 200, 0],
      [150, 200, 255, 255, 0, 0],
    ]);
    expect(result).not.toBe(image);
  });
  it('out parameter set to self', () => {
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 1, column: 1 },
      { row: 0, column: 1 },
    ];
    const result = image.drawPolyline(points, {
      strokeColor: [255, 0, 0],
      out: image,
    });

    expect(result).toMatchImageData([
      [255, 0, 0, 255, 0, 0],
      [100, 200, 5, 255, 0, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    expect(result).toBe(image);
  });
  it('out to other image', () => {
    const out = new IJS(2, 4);
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 1, column: 1 },
      { row: 2, column: 1 },
    ];
    const result = image.drawPolyline(points, {
      strokeColor: [255, 0, 0],
      out,
    });

    expect(result).toMatchImageData([
      [255, 0, 0, 100, 150, 0],
      [100, 200, 5, 255, 0, 0],
      [150, 200, 255, 255, 0, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    expect(result).toBe(out);
    expect(result).not.toBe(image);
  });
  it('should handle duplicate points', () => {
    const image = testUtils.createGreyImage([
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
    const result = image.drawPolyline(points, { strokeColor: [1] });

    expect(result).toMatchImageData([
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 1, 0],
    ]);
    expect(result).not.toBe(image);
  });
});
