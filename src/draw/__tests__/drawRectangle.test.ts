import { IJS } from '../../IJS';

describe('we check drawRectangle', () => {
  const start = { row: 0, column: 0 };
  it('draw rectangle in an image', () => {
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);

    const expected = image.drawRectangle(start, image.width, image.height, {
      color: [255, 0, 0],
    });

    expect(expected).toMatchImageData([
      [255, 0, 0, 255, 0, 0],
      [255, 0, 0, 255, 0, 0],
      [255, 0, 0, 255, 0, 0],
    ]);
    expect(expected).not.toBe(image);
  });
  it('draw rectangle with out parameter set to self', () => {
    const image = testUtils.createRgbImage([
      [100, 100, 200, 100, 100, 100, 150, 200, 255],
      [100, 100, 5, 3, 100, 100, 150, 200, 255],
      [100, 100, 255, 6, 150, 5, 5, 3, 200],
    ]);

    const expected = image.drawRectangle(start, image.width, image.height, {
      color: [255, 0, 0],
      fill: [0, 5, 2],
      out: image,
    });
    expect(expected).toMatchImageData([
      [255, 0, 0, 255, 0, 0, 255, 0, 0],
      [255, 0, 0, 0, 5, 2, 255, 0, 0],
      [255, 0, 0, 255, 0, 0, 255, 0, 0],
    ]);
    expect(expected).toBe(image);
  });
  it('draw rectangle with out parameter', () => {
    const out = new IJS(2, 3);
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    const expected = image.drawRectangle(start, image.width, image.height, {
      color: [255, 0, 0],
      fill: [1, 1, 1],
      out,
    });
    expect(expected).toMatchImageData([
      [255, 0, 0, 255, 0, 0],
      [255, 0, 0, 255, 0, 0],
      [255, 0, 0, 255, 0, 0],
    ]);
    expect(expected).toBe(out);
    expect(expected).not.toBe(image);
  });
  it('draw rectangle in grey image', () => {
    const image = testUtils.createGreyImage([
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
    ]);
    const expected = image.drawRectangle(start, image.width, image.height, {
      color: [2],
    });
    expect(expected).toMatchImageData([
      [2, 2, 2, 2, 2, 2],
      [2, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 2],
      [2, 2, 2, 2, 2, 2],
    ]);
    expect(expected).not.toBe(image);
  });
  it('draw filled rectangle in grey image', () => {
    const image = testUtils.createGreyImage([
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
    ]);
    const expected = image.drawRectangle(start, image.width, image.height, {
      color: [2],
      fill: [3],
    });
    expect(expected).toMatchImageData([
      [2, 2, 2, 2, 2, 2],
      [2, 3, 3, 3, 3, 2],
      [2, 3, 3, 3, 3, 2],
      [2, 3, 3, 3, 3, 2],
      [2, 3, 3, 3, 3, 2],
      [2, 2, 2, 2, 2, 2],
    ]);
    expect(expected).not.toBe(image);
  });
  it('draw filled rectangle with no stroke', () => {
    const image = testUtils.createGreyImage([
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
    ]);
    const expected = image.drawRectangle(start, image.width, image.height, {
      color: 'none',
      fill: [3],
    });
    expect(expected).toMatchImageData([
      [1, 1, 1, 1, 1, 1],
      [1, 3, 3, 3, 3, 1],
      [1, 3, 3, 3, 3, 1],
      [1, 3, 3, 3, 3, 1],
      [1, 3, 3, 3, 3, 1],
      [1, 1, 1, 1, 1, 1],
    ]);
    expect(expected).not.toBe(image);
  });
  it('draw rectangle with no options', () => {
    const image = testUtils.createGreyImage([
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
    ]);
    const expected = image.drawRectangle(start, image.width, image.height);
    expect(expected).toMatchImageData([
      [0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
    expect(expected).not.toBe(image);
  });
});
