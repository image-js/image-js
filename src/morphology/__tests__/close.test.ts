describe('close', () => {
  it('check for GREY image 5x5', () => {
    let kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    let image = testUtils.createGreyImage([
      [255, 255, 0, 255, 255],
      [255, 0, 0, 0, 255],
      [255, 0, 0, 0, 255],
      [255, 0, 0, 0, 255],
      [255, 255, 0, 255, 255],
    ]);

    expect(image.close({ kernel })).toMatchImageData([
      [255, 255, 255, 255, 255],
      [255, 0, 0, 0, 255],
      [255, 0, 0, 0, 255],
      [255, 0, 0, 0, 255],
      [255, 255, 255, 255, 255],
    ]);
  });

  it('check for GREY image 5x5 2 iterations', () => {
    let kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    let image = testUtils.createGreyImage([
      [255, 255, 0, 255, 255],
      [255, 0, 0, 0, 255],
      [255, 0, 0, 0, 255],
      [255, 0, 0, 0, 255],
      [255, 255, 0, 255, 255],
    ]);

    expect(image.close({ kernel, iterations: 2 })).toMatchImageData([
      [255, 255, 255, 255, 255],
      [255, 0, 0, 0, 255],
      [255, 0, 0, 0, 255],
      [255, 0, 0, 0, 255],
      [255, 255, 255, 255, 255],
    ]);
  });

  it('check on 5x5 mask', () => {
    let mask = testUtils.createMask(`
      1 1 0 1 1
      1 0 0 0 1
      1 0 0 0 1
      1 0 0 0 1
      1 1 0 1 1
    `);

    expect(mask.close()).toMatchMaskData(`
        1 1 1 1 1
        1 0 0 0 1
        1 0 0 0 1
        1 0 0 0 1
        1 1 1 1 1
    `);
  });
});
