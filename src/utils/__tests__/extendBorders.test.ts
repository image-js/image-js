import { extendBorders } from '../extendBorders';

test('grey image with wrap', () => {
  const image = testUtils.createGreyImage(`
    1 2 3 4
    2 3 4 5
    3 4 5 6
    4 5 6 7
    5 6 7 8
  `);

  const newImage = extendBorders(image, {
    horizontal: 2,
    vertical: 3,
    borderType: 'wrap',
  });

  expect(newImage).toMatchImageData(` 
    5   6   3   4   5   6   3   4
    6   7   4   5   6   7   4   5
    7   8   5   6   7   8   5   6
    3   4   1   2   3   4   1   2
    4   5   2   3   4   5   2   3
    5   6   3   4   5   6   3   4
    6   7   4   5   6   7   4   5
    7   8   5   6   7   8   5   6
    3   4   1   2   3   4   1   2
    4   5   2   3   4   5   2   3
    5   6   3   4   5   6   3   4
  `);
});

test('rgb image with default border type', () => {
  const image = testUtils.createRgbImage(`
    1  2  3 | 4  5  6
    11 12 13| 14 15 16
  `);

  const newImage = extendBorders(image, {
    horizontal: 1,
    vertical: 1,
  });

  expect(newImage).toMatchImageData(`
     14  15  16  11  12  13  14  15  16  11  12  13
      4   5   6   1   2   3   4   5   6   1   2   3
     14  15  16  11  12  13  14  15  16  11  12  13
      4   5   6   1   2   3   4   5   6   1   2   3
  `);
});
