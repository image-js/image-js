import { IJS } from '../../IJS';

describe('we check drawline', () => {
  it('draw line image', () => {
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);

    const from = { row: 0, column: 0 };
    const to = { row: 1, column: 1 };
    const expected = image.drawLine(from, to, { color: [255, 0, 0] });

    expect(expected).toMatchImageData([
      [255, 0, 0, 100, 150, 0],
      [100, 200, 5, 255, 0, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    expect(expected).not.toBe(image);
  });
  it('draw line with out parameter set to self', () => {
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);

    const from = { row: 0, column: 0 };
    const to = { row: 1, column: 1 };
    const expected = image.drawLine(from, to, {
      color: [255, 0, 0],
      out: image,
    });

    expect(expected).toMatchImageData([
      [255, 0, 0, 100, 150, 0],
      [100, 200, 5, 255, 0, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    expect(expected).toBe(image);
  });
  it('draw line with out parameter', () => {
    const out = new IJS(2, 3);
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    const from = { row: 0, column: 0 };
    const to = { row: 1, column: 1 };
    const expected = image.drawLine(from, to, {
      color: [255, 0, 0],
      out,
    });

    expect(expected).toMatchImageData([
      [255, 0, 0, 100, 150, 0],
      [100, 200, 5, 255, 0, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    expect(expected).toBe(out);
    expect(expected).not.toBe(image);
  });
  it('draw horizontal line', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const from = { row: 1, column: 0 };
    const to = { row: 2, column: 3 };
    const expected = image.drawLine(from, to, {
      color: [1],
    });
    expect(expected).toMatchImageData([
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 0, 0],
    ]);
    expect(expected).not.toBe(image);
  });
  it('draw vertical line', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const from = { row: 0, column: 1 };
    const to = { row: 3, column: 2 };
    const expected = image.drawLine(from, to, {
      color: [1],
    });
    expect(expected).toMatchImageData([
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ]);
    expect(expected).not.toBe(image);
  });
});
