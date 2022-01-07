describe('subtractImage', () => {
  it('subtract image to itself', async () => {
    const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
    const other = image;
    expect(image.subtractImage(other)).toMatchImageData([
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });
  it('test absolute = false', async () => {
    const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
    const other = testUtils.createRgbImage([[0, 0, 0, 20, 20, 20, 15, 15, 15]]);
    expect(image.subtractImage(other, { absolute: false })).toMatchImageData([
      [5, 5, 5, 0, 0, 0, 0, 0, 0],
    ]);
  });
  it('test absolute = true', async () => {
    const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
    const other = testUtils.createRgbImage([[0, 0, 0, 20, 20, 20, 15, 15, 15]]);
    expect(image.subtractImage(other, { absolute: true })).toMatchImageData([
      [5, 5, 5, 10, 10, 10, 0, 0, 0],
    ]);
  });
  it('subtract mask to itself', async () => {
    const image = testUtils.createMask([[1, 1, 0, 0]]);
    const other = image;
    expect(image.subtractImage(other)).toMatchMaskData([[0, 0, 0, 0]]);
  });
  it('absolute = false with masks', async () => {
    const image = testUtils.createMask([[1, 1, 0, 0]]);
    const other = testUtils.createMask([[1, 1, 1, 1]]);
    expect(image.subtractImage(other)).toMatchMaskData([[0, 0, 0, 0]]);
  });
  it('absolute = true with masks', async () => {
    const image = testUtils.createMask([[1, 1, 0, 0]]);
    const other = testUtils.createMask([[1, 1, 1, 1]]);
    expect(image.subtractImage(other, { absolute: true })).toMatchMaskData([
      [0, 0, 1, 1],
    ]);
  });
  it('difference size images should throw', async () => {
    const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
    const other = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10]]);
    expect(() => {
      image.subtractImage(other);
    }).toThrow(`subtractImage: both images must have the same size`);
  });

  it('different alpha should throw', async () => {
    const image = testUtils.createRgbaImage([
      [5, 5, 5, 0, 10, 10, 10, 0, 15, 15, 15, 0],
    ]);
    const other = testUtils.createRgbImage([[1, 1, 1, 5, 5, 5, 10, 10, 10]]);
    expect(() => {
      image.subtractImage(other);
    }).toThrow(`subtractImage: both images must have the same alpha and depth`);
  });

  it('different number of channels should throw', async () => {
    const image = testUtils.createGreyImage([[5, 10, 15]]);
    const other = testUtils.createRgbImage([[1, 1, 1, 5, 5, 5, 10, 10, 10]]);
    expect(() => {
      image.subtractImage(other);
    }).toThrow(
      `subtractImage: both images must have the same number of channels`,
    );
  });
});
