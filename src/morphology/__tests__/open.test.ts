describe('open', () => {
  it('GREY image 5x5', () => {
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

    expect(image.open({ kernel })).toMatchImageData([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });

  it('GREY image 5x5, 2 iterations', () => {
    let image = testUtils.createGreyImage([
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
});
