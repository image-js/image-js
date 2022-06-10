describe('bottom hat', () => {
  it('GREY image 5x5', () => {
    let image = testUtils.createGreyImage([
      [0, 0, 255, 0, 0],
      [0, 255, 255, 255, 0],
      [0, 255, 255, 255, 0],
      [0, 255, 255, 255, 0],
      [0, 0, 255, 0, 0],
    ]);

    expect(image.bottomHat()).toMatchImageData([
      [255, 255, 0, 255, 255],
      [255, 0, 0, 0, 255],
      [255, 0, 0, 0, 255],
      [255, 0, 0, 0, 255],
      [255, 255, 0, 255, 255],
    ]);
  });

  it('GREY image 5x5, 2 iterations', () => {
    let image = testUtils.createGreyImage([
      [0, 0, 255, 0, 0],
      [0, 255, 255, 255, 0],
      [0, 255, 255, 255, 0],
      [0, 255, 255, 255, 0],
      [0, 0, 255, 0, 0],
    ]);

    expect(image.bottomHat({ iterations: 2 })).toMatchImageData([
      [0, 0, 255, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 255, 0, 0],
    ]);
  });
  it('mask 5x5', () => {
    let mask = testUtils.createMask([
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ]);

    expect(mask.bottomHat()).toMatchMaskData([
      [1, 1, 0, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 0, 1, 1],
    ]);
  });

  it('mask 5x5, 2 iterations', () => {
    let mask = testUtils.createMask([
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ]);

    expect(mask.bottomHat({ iterations: 2 })).toMatchMaskData([
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
    ]);
  });
});
