import flipY from '../flipY.js';

test('should flip pixels vertically of all RGBA components for a [2,1] image', () => {
  const image = testUtils.createRgbaImage([[1, 2, 3, 4, 5, 6, 7, 8]]);

  const expected = flipY(image);
  expect(expected).toMatchImageData([[1, 2, 3, 4, 5, 6, 7, 8]]);
});

test('should flip pixels vertically of all RGBA components for a [2,2] image', () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15, 16],
  ]);
  const expected = flipY(image);
  expect(expected).toMatchImageData([
    [9, 10, 11, 12, 13, 14, 15, 16],
    [1, 2, 3, 4, 5, 6, 7, 8],
  ]);
});

test('should flip pixels vertically of all RGBA components for a [3,2] image', () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  ]);

  const expected = flipY(image);
  expect(expected).toMatchImageData([
    [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  ]);
});

test('should flip pixels vertically of all RGBA components for a [2,3] image', () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23, 24],
  ]);

  const expected = flipY(image);
  expect(expected).toMatchImageData([
    [17, 18, 19, 20, 21, 22, 23, 24],
    [9, 10, 11, 12, 13, 14, 15, 16],
    [1, 2, 3, 4, 5, 6, 7, 8],
  ]);
});

test('should flip pixels vertically of GREY image', () => {
  const image = testUtils.createGreyImage([
    [1, 2],
    [3, 4],
  ]);

  const expected = flipY(image);
  expect(expected).toMatchImageData([
    [3, 4],
    [1, 2],
  ]);
});
