import { IJS } from '../../IJS';

describe('flip', () => {
  it('invert with out parameter', () => {
    const out = new IJS(2, 2);
    const image = testUtils.createRgbImage([
      [1, 2, 3, 5, 6, 7],
      [9, 10, 11, 13, 14, 15],
    ]);

    const expected = image.flip({ out });
    expect(expected).toMatchImageData([
      [5, 6, 7, 1, 2, 3],
      [13, 14, 15, 9, 10, 11],
    ]);
    expect(expected).toBe(out);
    expect(expected).not.toBe(image);
  });
  it('flip with out parameter set to self', () => {
    const image = testUtils.createRgbaImage([[1, 2, 3, 4, 5, 6, 7, 8]]);
    image.flip({ out: image });
    expect(image).toMatchImageData([[5, 6, 7, 8, 1, 2, 3, 4]]);
  });
  it('flip pixels horizontally', () => {
    const image = testUtils.createRgbaImage([
      [1, 2, 3, 4, 5, 6, 7, 8],
      [9, 10, 11, 12, 13, 14, 15, 16],
    ]);
    const expected = image.flip();
    expect(expected).not.toBe(image);
    expect(expected).toMatchImageData([
      [5, 6, 7, 8, 1, 2, 3, 4],
      [13, 14, 15, 16, 9, 10, 11, 12],
    ]);
  });

  it('flip pixels vertically', () => {
    const image = testUtils.createRgbaImage([
      [1, 2, 3, 4, 5, 6, 7, 8],
      [9, 10, 11, 12, 13, 14, 15, 16],
      [17, 18, 19, 20, 21, 22, 23, 24],
    ]);

    const expected = image.flip({ axis: 'vertical' });
    expect(expected).not.toBe(image);
    expect(expected).toMatchImageData([
      [17, 18, 19, 20, 21, 22, 23, 24],
      [9, 10, 11, 12, 13, 14, 15, 16],
      [1, 2, 3, 4, 5, 6, 7, 8],
    ]);
  });

  it('flip pixels vertically and horizontally', () => {
    const image = testUtils.createRgbImage([
      [1, 2, 3, 5, 6, 7],
      [9, 10, 11, 13, 14, 15],
    ]);

    const expected = image.flip({ axis: 'both' });
    expect(expected).toMatchImageData([
      [13, 14, 15, 9, 10, 11],
      [5, 6, 7, 1, 2, 3],
    ]);
    expect(expected).not.toBe(image);
  });
});
