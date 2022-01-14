describe('top hat', () => {
  it('GREY image 5x5, default kernel', () => {
    let image = testUtils.createGreyImage([
      [0, 0, 255, 0, 0],
      [0, 255, 255, 255, 0],
      [0, 255, 255, 255, 0],
      [0, 255, 255, 255, 0],
      [0, 0, 255, 0, 0],
    ]);

    expect(image.topHat()).toMatchImageData([
      [0, 0, 255, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 255, 0, 0],
    ]);
  });
  it('GREY image 5x5,default kernel, 2 iterations', () => {
    let kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    let image = testUtils.createGreyImage([
      [0, 0, 255, 0, 0],
      [0, 255, 255, 255, 0],
      [0, 255, 255, 255, 0],
      [0, 255, 255, 255, 0],
      [0, 0, 255, 0, 0],
    ]);

    expect(image.topHat({ kernel: kernel, iterations: 2 })).toMatchImageData([
      [0, 0, 255, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 255, 0, 0],
    ]);
  });
  it('Mask 5x5, default kernel', () => {
    let image = testUtils.createMask([
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ]);

    expect(image.topHat()).toMatchMaskData([
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
    ]);
  });
});
