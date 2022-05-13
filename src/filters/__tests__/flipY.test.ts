import flipY from '../flipY';

describe('flipY', () => {
  it('should flip pixels vertically of all RGBA components for a [2,1] image', () => {
    let image = testUtils.createRgbaImage([[1, 2, 3, 4, 5, 6, 7, 8]]);

    const expected = flipY(image);
    expect(expected).toMatchImageData([[1, 2, 3, 4, 5, 6, 7, 8]]);
  });
  it('should flip pixels vertically of all RGBA components for a [2,2] image', () => {
    let image = testUtils.createRgbaImage([
      [1, 2, 3, 4, 5, 6, 7, 8],
      [9, 10, 11, 12, 13, 14, 15, 16],
    ]);
    const expected = flipY(image);
    expect(expected).toMatchImageData([
      [9, 10, 11, 12, 13, 14, 15, 16],
      [1, 2, 3, 4, 5, 6, 7, 8],
    ]);
  });

  it('should flip pixels vertically of all RGBA components for a [3,2] image', () => {
    let image = testUtils.createRgbaImage([
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    ]);

    const expected = flipY(image);
    expect(expected).toMatchImageData([
      [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    ]);
  });

  it('should flip pixels vertically of all RGBA components for a [2,3] image', () => {
    let image = testUtils.createRgbaImage([
      [1, 2, 3, 4, 5, 6, 7, 8],
      [9, 10, 11, 12, 13, 14, 15, 16],
      [17, 18, 19, 20, 21, 22, 23, 24],
    ]);

    const expected = flipY(image);
    expect(expected).toMatchImageData([
      [17, 18, 19, 20, 21, 22, 23, 24],
      [9, 10, 11, 12, 13, 14, 15, 16],
      [1, 2, 3, 4, 5, 6, 7, 8],
    ]);
  });

  it('should flip pixels vertically of GREY image', () => {
    let image = testUtils.createGreyImage([
      [1, 2],
      [3, 4],
    ]);

    const expected = flipY(image);
    expect(expected).toMatchImageData([
      [3, 4],
      [1, 2],
    ]);
  });
});
