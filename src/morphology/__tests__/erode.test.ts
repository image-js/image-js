describe('erode', () => {
  it('GREY image 5x5', () => {
    let image = testUtils.createGreyImage([
      [255, 0, 255, 255, 255],
      [255, 0, 255, 255, 255],
      [255, 0, 255, 255, 255],
      [255, 0, 255, 255, 255],
      [255, 0, 255, 255, 255],
    ]);

    expect(image.erode()).toMatchImageData([
      [0, 0, 0, 255, 255],
      [0, 0, 0, 255, 255],
      [0, 0, 0, 255, 255],
      [0, 0, 0, 255, 255],
      [0, 0, 0, 255, 255],
    ]);
  });

  it('another GREY image 5x5', () => {
    let image = testUtils.createGreyImage([
      [255, 255, 255, 255, 255],
      [255, 255, 0, 255, 255],
      [255, 0, 0, 0, 255],
      [255, 255, 0, 255, 255],
      [255, 255, 255, 255, 255],
    ]);

    const expected = [
      [255, 0, 0, 0, 255],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [255, 0, 0, 0, 255],
    ];

    expect(image.erode()).toMatchImageData(expected);
  });

  it('GREY image 5x5, 1x3 onlyOnes kernel', () => {
    const kernel = [[1, 1, 1]];

    let image = testUtils.createGreyImage([
      [255, 255, 255, 255, 255],
      [255, 255, 0, 255, 255],
      [255, 0, 0, 0, 255],
      [255, 255, 0, 255, 255],
      [255, 255, 255, 255, 255],
    ]);

    const expected = [
      [255, 255, 255, 255, 255],
      [255, 0, 0, 0, 255],
      [0, 0, 0, 0, 0],
      [255, 0, 0, 0, 255],
      [255, 255, 255, 255, 255],
    ];

    expect(image.erode({ kernel })).toMatchImageData(expected);
  });

  it('GREY image 5x5, 1x3 kernel with zeros', () => {
    const kernel = [[1, 0, 1]];

    let image = testUtils.createGreyImage([
      [255, 255, 255, 255, 255],
      [255, 255, 0, 255, 255],
      [255, 0, 0, 0, 255],
      [255, 255, 0, 255, 255],
      [255, 255, 255, 255, 255],
    ]);

    const expected = [
      [255, 255, 255, 255, 255],
      [255, 0, 255, 0, 255],
      [0, 0, 0, 0, 0],
      [255, 0, 255, 0, 255],
      [255, 255, 255, 255, 255],
    ];

    expect(image.erode({ kernel })).toMatchImageData(expected);
  });

  it('mask 5x5', () => {
    let mask = testUtils.createMask(`
      1 0 1 1 1
      1 0 1 1 1
      1 0 1 1 1
      1 0 1 1 1
      1 0 1 1 1
    `);

    expect(mask.erode()).toMatchMaskData(`
        0 0 0 1 1
        0 0 0 1 1
        0 0 0 1 1
        0 0 0 1 1
        0 0 0 1 1
      `);
  });

  it('erode with 2 iterations', () => {
    let mask = testUtils.createMask(`
      1 0 1 1 1
      1 0 1 1 1
      1 0 1 1 1
      1 0 1 1 1
      1 0 1 1 1
    `);

    const expected = `
      0 0 0 0 1
      0 0 0 0 1
      0 0 0 0 1
      0 0 0 0 1
      0 0 0 0 1
    `;

    expect(mask.erode({ iterations: 2 })).toMatchMaskData(expected);
  });

  it('5x5 mask', () => {
    const mask = testUtils.createMask(`
      1 1 1 1 1
      1 1 0 1 1
      1 0 0 0 1
      1 1 0 1 1
      1 1 1 1 1
    `);

    expect(mask.erode()).toMatchMaskData(`
      1 0 0 0 1
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      1 0 0 0 1
    `);
  });

  it('another 5x5 mask', () => {
    const mask = testUtils.createMask(`
      1 1 0 1 1
      1 1 0 1 1
      0 0 0 0 0
      1 1 0 1 1
      1 1 0 1 1
    `);

    const expected = `
      1 0 0 0 1
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      1 0 0 0 1`;

    expect(mask.erode()).toMatchMaskData(expected);
  });

  it('mask 5x3, 3x1 kernel onlyOnes', () => {
    const kernel = [[1], [1], [1]];
    const mask = testUtils.createMask(`
      1 1 0
      1 0 0
      1 1 1
      0 0 1
      0 1 1
    `);

    const expected = `
      1 0 0
      1 0 0
      0 0 0
      0 0 1
      0 0 1
    `;

    expect(mask.erode({ kernel })).toMatchMaskData(expected);
  });

  it('mask 5x3, 3x1 kernel with zeros', () => {
    const kernel = [[1], [1], [0]];
    const mask = testUtils.createMask(`
      1 1 0
      1 0 0
      1 1 1
      0 0 1
      0 1 1
    `);

    const expected = `
      1 1 0
      1 0 0
      1 0 0
      0 0 1
      0 0 1
    `;

    expect(mask.erode({ kernel })).toMatchMaskData(expected);
  });
  it('mask 5x5, kernel with holes', () => {
    const kernel = [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ];
    const mask = testUtils.createMask(`
      1 1 1 1 1
      1 1 1 1 1
      1 1 1 0 1
      1 1 1 1 1
      1 1 1 1 1
    `);

    const expected = `
      1 1 1 1 1
      1 1 0 0 0
      1 1 0 1 0
      1 1 0 0 0
      1 1 1 1 1
    `;

    expect(mask.erode({ kernel })).toMatchMaskData(expected);
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
      mask.erode({ kernel });
    }).toThrow(
      /erode: The number of rows and columns of the kernel must be odd/,
    );
  });
});
