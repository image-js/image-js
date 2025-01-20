import { Image } from '../../Image.js';

test('GREY image, default options', () => {
  const image = testUtils.createGreyImage([
    [0, 1, 2],
    [1, 1, 1],
    [1, 2, 2],
  ]);

  const result = image.crop();
  expect(result).toMatchImage(image);
});

test('GREY image, various origins and sizes', () => {
  const image = testUtils.createGreyImage([
    [0, 1, 2, 3, 4],
    [1, 1, 1, 1, 1],
    [1, 2, 2, 2, 0],
    [1, 2, 4, 3, 0],
    [1, 2, 3, 3, 0],
  ]);
  let result = image.crop({
    origin: { row: 2, column: 2 },
  });
  expect(result).toMatchImageData([
    [2, 2, 0],
    [4, 3, 0],
    [3, 3, 0],
  ]);

  result = image.crop({
    origin: { row: 0, column: 0 },
    height: 2,
    width: 2,
  });
  expect(result).toMatchImageData([
    [0, 1],
    [1, 1],
  ]);

  result = image.crop({
    origin: { row: 2, column: 2 },
    height: 2,
    width: 2,
  });
  expect(result).toMatchImageData([
    [2, 2],
    [4, 3],
  ]);

  result = image.crop({
    origin: { row: 1, column: 3 },
    height: 1,
  });
  expect(result).toMatchImageData([[1, 1]]);
});

test('invalid argument ranges', () => {
  const image = new Image(5, 5);

  expect(() => {
    image.crop({
      origin: { column: -10, row: 2 },
      height: 2,
      width: 2,
    });
  }).toThrow(/Row and column .* must be positive numbers/);

  expect(() => {
    image.crop({
      origin: { column: 2, row: 2 },
      height: -2,
      width: 2,
    });
  }).toThrow(/Width and height .* must be positive numbers/);

  expect(() => {
    image.crop({
      origin: { column: 100, row: 2 },
      height: 2,
      width: 2,
    });
  }).toThrow(/Origin .* out of range/);

  expect(() => {
    image.crop({
      origin: { column: 2, row: 2 },
      height: 2,
      width: 100,
    });
  }).toThrow(/Size is out of range/);
});

test('origin is not integer', () => {
  const image = testUtils.createGreyImage([
    [0, 1, 2, 3, 4],
    [1, 1, 1, 1, 1],
    [1, 2, 2, 2, 0],
    [1, 2, 4, 3, 0],
    [1, 2, 3, 3, 0],
  ]);
  expect(() => {
    image.crop({
      origin: { row: 1.5, column: 1.5 },
    });
  }).toThrow('Origin row and column must be integers');
});

test('width is not integer', () => {
  const image = testUtils.createGreyImage([
    [0, 1, 2, 3, 4],
    [1, 1, 1, 1, 1],
    [1, 2, 2, 2, 0],
    [1, 2, 4, 3, 0],
    [1, 2, 3, 3, 0],
  ]);
  expect(() => {
    image.crop({ width: 3.5 });
  }).toThrow('Width and height (width:3.5; height:5) must be integers');
});
