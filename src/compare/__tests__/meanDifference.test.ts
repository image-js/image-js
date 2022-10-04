test('twice the same image', async () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = image;
  expect(image.meanDifference(other)).toBe(0);
});
