describe('open', () => {
  it('GREY image 5x5', () => {
    let kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    const image = testUtils.createGreyImage([
      [255, 255, 0, 255, 255],
      [255, 0, 0, 0, 255],
      [255, 0, 0, 0, 255],
      [255, 0, 0, 0, 255],
      [255, 255, 0, 255, 255],
    ]);

    expect(image.open({ kernel })).toMatchImageData([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });

  it('GREY image 5x5, 2 iterations', () => {
    const image = testUtils.createGreyImage([
      [255, 255, 255, 255, 255],
      [255, 255, 0, 255, 255],
      [255, 0, 0, 0, 255],
      [255, 255, 0, 255, 255],
      [255, 255, 255, 255, 255],
    ]);

    expect(image.open({ iterations: 2 })).toMatchImageData([
      [255, 255, 0, 255, 255],
      [255, 255, 0, 255, 255],
      [0, 0, 0, 0, 0],
      [255, 255, 0, 255, 255],
      [255, 255, 0, 255, 255],
    ]);
  });

  it('even kernel size error', () => {
    const kernel = [
      [1, 1, 1],
      [1, 0, 1],
    ];
    const mask = testUtils.createMask(`
      1 1 1 1 1
      1 1 1 1 1
      1 1 1 0 1
      1 1 1 1 1
      1 1 1 1 1
    `);

    expect(() => {
      mask.open({ kernel });
    }).toThrow(
      /open: The number of rows and columns of the kernel must be odd/,
    );
  });
});
