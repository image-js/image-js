describe('paintMask', () => {
  it('3x3 grey image, default options', () => {
    const image = testUtils.createGreyImage([
      [30, 23, 2],
      [45, 65, 1],
      [1, 2, 2],
    ]);
    const mask = testUtils.createMask([
      [0, 1],
      [1, 0],
    ]);
    const result = image.paintMask(mask);

    expect(result).toMatchImageData([
      [30, 0, 2],
      [0, 65, 1],
      [1, 2, 2],
    ]);
  });
  it.only('3x3 grey image, offset', () => {
    const image = testUtils.createGreyImage([
      [30, 23, 2],
      [45, 65, 1],
      [1, 2, 2],
    ]);
    const mask = testUtils.createMask([
      [0, 1],
      [1, 0],
    ]);
    const result = image.paintMask(mask, { column: 1 });

    console.log(result);

    expect(result).toMatchImageData([
      [30, 23, 0],
      [45, 0, 1],
      [1, 2, 2],
    ]);
  });
  it('3x3 grey image, negative offset', () => {
    const image = testUtils.createGreyImage([
      [30, 23, 2],
      [45, 65, 1],
      [1, 2, 2],
    ]);
    const mask = testUtils.createMask([
      [0, 1, 1],
      [1, 0, 1],
    ]);
    const result = image.paintMask(mask, { column: -1 });

    console.log(result);

    expect(result).toMatchImageData([
      [0, 0, 2],
      [45, 0, 1],
      [1, 2, 2],
    ]);
  });
  it('3x3 grey image, custom color', () => {
    const image = testUtils.createGreyImage([
      [30, 23, 2],
      [45, 65, 1],
      [1, 2, 2],
    ]);
    const mask = testUtils.createMask([
      [1, 1],
      [1, 0],
    ]);
    const result = image.paintMask(mask, { color: [100] });

    expect(result).toMatchImageData([
      [100, 100, 2],
      [100, 65, 1],
      [1, 2, 2],
    ]);
  });
});
