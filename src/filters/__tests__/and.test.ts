describe('and', () => {
  it('mask AND itself', () => {
    const image = testUtils.createMask([[1, 1, 1, 1, 1, 1, 1, 1]]);
    const other = image;
    expect(image.and(other)).toMatchMaskData([[1, 1, 1, 1, 1, 1, 1, 1]]);
  });
  it('two different masks', () => {
    const image = testUtils.createMask([[0, 0, 0, 0, 1, 1, 1, 1]]);
    const other = testUtils.createMask([[1, 1, 1, 1, 0, 0, 0, 0]]);
    expect(image.and(other)).toMatchMaskData([[0, 0, 0, 0, 0, 0, 0, 0]]);
  });
  it('different size error', () => {
    const image = testUtils.createMask([[0, 0, 0, 0, 1, 1, 1, 1]]);
    const other = testUtils.createMask([[1, 1, 1, 0, 0, 0]]);
    expect(() => {
      image.and(other);
    }).toThrow('and: both masks must have the same size');
  });
});
