describe('or', () => {
  it('mask OR itself', () => {
    const image = testUtils.createMask([[1, 1, 1, 1, 1, 1, 1, 1]]);
    const other = image;
    expect(image.or(other)).toMatchMaskData([[1, 1, 1, 1, 1, 1, 1, 1]]);
  });
  it('two different masks', () => {
    const image = testUtils.createMask([[0, 0, 0, 0, 1, 1, 1, 1]]);
    const other = testUtils.createMask([[1, 1, 1, 1, 0, 0, 0, 0]]);
    expect(image.or(other)).toMatchMaskData([[1, 1, 1, 1, 1, 1, 1, 1]]);
  });
  it('test when OR returns 0', () => {
    const image = testUtils.createMask([[0, 0, 0, 0, 1, 1, 1, 1]]);
    const other = testUtils.createMask([[0, 1, 0, 1, 0, 0, 0, 0]]);
    expect(image.or(other)).toMatchMaskData([[0, 1, 0, 1, 1, 1, 1, 1]]);
  });
  it('different size error', () => {
    const image = testUtils.createMask([[0, 0, 0, 0, 1, 1, 1, 1]]);
    const other = testUtils.createMask([[1, 1, 1, 0, 0, 0]]);
    expect(() => {
      image.or(other);
    }).toThrow('or: both masks must have the same size');
  });
});
