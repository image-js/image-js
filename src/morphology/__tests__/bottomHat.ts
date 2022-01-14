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
});
