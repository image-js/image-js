import { IJS } from '../../IJS';
import { drawPolygonOnIjs } from '../drawPolygonOnIjs';

describe('drawPolygon on IJS', () => {
  it('RGB image', () => {
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 1, column: 1 },
    ];
    const result = image.drawPolygon(points, { strokeColor: [255, 0, 0] });
    expect(result).toMatchImageData([
      [255, 0, 0, 100, 150, 0],
      [100, 200, 5, 255, 0, 0],
      [150, 200, 255, 6, 150, 0],
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
      { row: 2, column: 0 },
    ];
    const result = image.drawPolygon(points, {
      strokeColor: [255, 0, 0],
      out: image,
    });

    expect(result).toMatchImageData([
      [255, 0, 0, 100, 150, 0],
      [255, 0, 0, 255, 0, 0],
      [255, 0, 0, 6, 150, 0],
    ]);
    expect(result).toBe(image);
  });
  it('out to other image', () => {
    const out = new IJS(2, 3);
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 1, column: 1 },
      { row: 2, column: 0 },
    ];
    const result = image.drawPolygon(points, {
      strokeColor: [255, 0, 0],
      out,
    });

    expect(result).toMatchImageData([
      [255, 0, 0, 100, 150, 0],
      [255, 0, 0, 255, 0, 0],
      [255, 0, 0, 6, 150, 0],
    ]);
    expect(result).toBe(out);
    expect(result).not.toBe(image);
  });
  it('drawPolygon with no points', () => {
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    const result = image.drawPolygon([], {
      strokeColor: [255, 0, 0],
    });

    expect(result).toMatchImage(image);
    expect(result).not.toBe(image);
  });
  it('grey image', () => {
    const image = testUtils.createGreyImage([
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
    const result = image.drawPolygon(points, {
      strokeColor: [1],
      fillColor: [2],
    });
    expect(result).toMatchImageData([
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [1, 2, 1, 0],
      [1, 1, 1, 1],
    ]);
    expect(result).not.toBe(image);
  });
  it('grey image, no fill', () => {
    const image = testUtils.createGreyImage([
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
    const result = image.drawPolygon(points, {
      strokeColor: [1],
    });
    expect(result).toMatchImageData([
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [1, 0, 1, 0],
      [1, 1, 1, 1],
    ]);
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
      { row: 3, column: 3 },
      { row: 3, column: 0 },
      { row: 3, column: 0 },
    ];
    const result = image.drawPolygon(points, {
      strokeColor: [1],
      fillColor: [2],
    });

    expect(result).toMatchImageData([
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [1, 2, 1, 0],
      [1, 1, 1, 1],
    ]);
    expect(result).not.toBe(image);
  });
  it('first and last points are the same', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 3, column: 3 },
      { row: 3, column: 0 },
      { row: 0, column: 0 },
    ];
    const result = image.drawPolygon(points, {
      strokeColor: [1],
      fillColor: [2],
    });

    expect(result).toMatchImageData([
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [1, 2, 1, 0],
      [1, 1, 1, 1],
    ]);
    expect(result).not.toBe(image);
  });
  it('stroke color not compatible with image', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 3, column: 3 },
      { row: 3, column: 0 },
      { row: 0, column: 0 },
    ];
    expect(() => {
      image.drawPolygon(points, {
        strokeColor: [1],
        fillColor: [2, 5],
      });
    }).toThrow('drawPolygon: fill color is not compatible with image.');
  });
  it('default options', () => {
    const image = testUtils.createGreyImage([
      [10, 10, 10, 10],
      [10, 10, 10, 10],
      [10, 10, 10, 10],
      [10, 10, 10, 10],
    ]);

    const points = [
      { row: 0, column: 0 },
      { row: image.height, column: image.width },
    ];
    const result = drawPolygonOnIjs(image, points);

    expect(result).toMatchImageData([
      [0, 10, 10, 10],
      [10, 0, 10, 10],
      [10, 10, 0, 10],
      [10, 10, 10, 0],
    ]);
  });
});
