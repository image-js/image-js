import { extractSquareImage } from '../extractSquareImage.js';

test('7x7 image, first origin', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [255, 255, 255, 0, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
  ]);

  const result = extractSquareImage(image, { column: 2, row: 2 }, 3);

  expect(result).toMatchImageData([
    [0, 0, 0],
    [0, 0, 0],
    [255, 255, 0],
  ]);
});

test('7x7 image, second origin', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [255, 255, 255, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
  ]);

  const result = extractSquareImage(image, { column: 3, row: 4 }, 3);
  expect(result).toMatchImageData([
    [255, 255, 0],
    [0, 255, 0],
    [0, 255, 0],
  ]);
});
