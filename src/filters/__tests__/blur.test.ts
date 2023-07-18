test('blur compared to opencv', () => {
  const img = testUtils.load('opencv/test.png');

  const blurred = img.blur({
    width: 3,
    height: 5,
    borderType: 'reflect',
  });

  const expected = testUtils.load('opencv/testBlur.png');
  expect(blurred).toMatchImage(expected);
});
