import { IJS } from '../../IJS';

describe('we check drawPolygon', () => {
  it('drawPolygon in an image', () => {
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 1, column: 1 },
    ];
    const expected = image.drawPolygon(points, { color: [255, 0, 0] });
    expect(expected).toMatchImageData([
      [255, 0, 0, 100, 150, 0],
      [100, 200, 5, 255, 0, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    expect(expected).not.toBe(image);
  });
  it('drawPolygon with out parameter set to self', () => {
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
    const expected = image.drawPolygon(points, {
      color: [255, 0, 0],
      out: image,
    });

    expect(expected).toMatchImageData([
      [255, 0, 0, 100, 150, 0],
      [255, 0, 0, 255, 0, 0],
      [255, 0, 0, 6, 150, 0],
    ]);
    expect(expected).toBe(image);
  });
  it('drawPolygon with out parameter', () => {
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
    const expected = image.drawPolygon(points, {
      color: [255, 0, 0],
      out,
    });

    expect(expected).toMatchImageData([
      [255, 0, 0, 100, 150, 0],
      [255, 0, 0, 255, 0, 0],
      [255, 0, 0, 6, 150, 0],
    ]);
    expect(expected).toBe(out);
    expect(expected).not.toBe(image);
  });
  it('drawPolygon with no points', () => {
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    const expected = image.drawPolygon([], {
      color: [255, 0, 0],
    });

    expect(expected).toMatchImageData([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    expect(expected).not.toBe(image);
  });
  it('drawPolygon in grey image', () => {
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
    const expected = image.drawPolygon(points, {
      color: [1],
      fill: [2],
      filled: true,
    });
    expect(expected).toMatchImageData([
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [1, 2, 1, 0],
      [1, 1, 1, 1],
    ]);
    expect(expected).not.toBe(image);
  });
});
