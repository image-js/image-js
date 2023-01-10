test('compare result of translation with opencv', () => {
  const img = testUtils.load('opencv/test.png');
  const translation = [
    [1, 0, 2],
    [0, 1, 4],
  ];
  const transformed = img.transform(translation, {
    width: 16,
    height: 20,
  });

  expect(transformed).toMatchImage('opencv/testTranslation.png');
});

// is this the expected result for the fullImage option??
test.skip('fullImage = true', () => {
  const img = testUtils.load('opencv/test.png');
  const translation = [
    [1, 0, 2],
    [0, 1, 10],
  ];
  const transformed = img.transform(translation, {
    width: 16,
    height: 15,
    fullImage: true,
  });

  expect(transformed).toMatchImage('opencv/testTranslation.png');
});

test('should throw if matrix has wrong size', () => {
  const img = testUtils.load('opencv/test.png');
  const translation = [
    [1, 0, 2, 3],
    [0, 1, 10, 4],
  ];
  expect(() => {
    img.transform(translation);
  }).toThrow('transform: transformation matrix must be 2x3, found 2x4');
});
