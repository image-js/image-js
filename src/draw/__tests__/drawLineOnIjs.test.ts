import { IJS } from '../../IJS';

describe('drawLine on IJS', () => {
  it('RGB image', () => {
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);

    const from = { row: 0, column: 0 };
    const to = { row: 1, column: 1 };
    const result = image.drawLine(from, to, { strokeColor: [255, 0, 0] });

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

    const from = { row: 0, column: 0 };
    const to = { row: 1, column: 1 };
    const result = image.drawLine(from, to, {
      strokeColor: [255, 0, 0],
      out: image,
    });

    expect(result).toMatchImageData([
      [255, 0, 0, 100, 150, 0],
      [100, 200, 5, 255, 0, 0],
      [150, 200, 255, 6, 150, 0],
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
    const from = { row: 0, column: 0 };
    const to = { row: 1, column: 1 };
    const result = image.drawLine(from, to, {
      strokeColor: [255, 0, 0],
      out,
    });

    expect(result).toMatchImageData([
      [255, 0, 0, 100, 150, 0],
      [100, 200, 5, 255, 0, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    expect(result).toBe(out);
    expect(result).not.toBe(image);
  });
  it('draw nearly horizontal line', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const from = { row: 1, column: 0 };
    const to = { row: 2, column: 3 };
    const result = image.drawLine(from, to, {
      strokeColor: [1],
    });
    expect(result).toMatchImageData([
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 0, 0],
    ]);
    expect(result).not.toBe(image);
  });
  it('draw nearly vertical line', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const from = { row: 0, column: 1 };
    const to = { row: 3, column: 2 };
    const result = image.drawLine(from, to, {
      strokeColor: [1],
    });
    expect(result).toMatchImageData([
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ]);
    expect(result).not.toBe(image);
  });
  it('same from and to', () => {
    const image = testUtils.createGreyImage([
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 0, 0, 0],
    ]);
    const from = { row: 0, column: 1 };
    const to = { row: 0, column: 1 };
    const result = image.drawLine(from, to, {
      strokeColor: [1],
    });

    expect(result).toMatchImage(image);
  });
  it('point contains image.width and image.height', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const from = { row: 0, column: 0 };
    const to = { row: image.height, column: image.width };
    const result = image.drawLine(from, to, {
      strokeColor: [1],
    });

    expect(result).toMatchImageData([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  });
});
