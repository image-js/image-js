test('twice the same image', async () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = image;
  expect(image.psnr(other)).toBe(Number.POSITIVE_INFINITY);
});

test('images are full of zeros', async () => {
  const image = testUtils.createRgbImage([[0, 0, 0, 0, 0, 0]]);
  const other = image;
  expect(image.psnr(other)).toBe(Number.POSITIVE_INFINITY);
});
test('should be symetrical', async () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4, 5]]);
  const other = testUtils.createGreyImage([[0, 0, 0, 0, 0]]);
  expect(image.psnr(other)).toBeCloseTo(37.717);
  expect(other.psnr(image)).toBeCloseTo(37.717);
});
test('RGBA images', async () => {
  const image = testUtils.createRgbaImage([[50, 100, 150, 200]]);
  const other = testUtils.createRgbaImage([[0, 50, 100, 150]]);
  expect(image.psnr(other)).toBe(20 * Math.log10(255 / 50));
});
