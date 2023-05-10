const image = testUtils.createGreyImage(`
 1 2 3
 4 5 6
`);

test('rotate by 90 degrees', () => {
  const rotated = image.rotate(90);

  expect(rotated).toMatchImageData(`
   4 1
   5 2
   6 3
  `);
});

test('rotate by 180 degrees', () => {
  const rotated = image.rotate(180);

  expect(rotated).toMatchImageData(`
   6 5 4
   3 2 1
  `);
});

test('rotate by 270 degrees', () => {
  const rotated = image.rotate(270);

  expect(rotated).toMatchImageData(`
   3 6
   2 5
   1 4
  `);
});

test('with an rgb image', () => {
  const image = testUtils.createRgbImage(`
   1 2 3 | 4 5 6
   7 8 9 | 10 11 12
  `);

  const rotated = image.rotate(90);

  expect(rotated).toMatchImageData(`
    7 8 9 | 1 2 3
    10 11 12 | 4 5 6
  `);
});
