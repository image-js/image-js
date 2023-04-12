import { Image } from '../../Image';

test('cross', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const point = { row: 2, column: 2 };

  const result = image.drawMarker(point, { color: [1] });
  expect(result).toMatchImageData([
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 1],
    [0, 0, 1, 0],
  ]);
  expect(result).not.toBe(image);
});
test('circle', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const point = { row: 2, column: 2 };

  const result = image.drawMarker(point, { color: [1], shape: 'circle' });
  expect(result).toMatchImageData([
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 1, 0, 1],
    [0, 0, 1, 0],
  ]);
  expect(result).not.toBe(image);
});
test('filled circle', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const point = { row: 2, column: 2 };

  const result = image.drawMarker(point, {
    color: [1],
    shape: 'circle',
    filled: true,
  });
  expect(result).toMatchImageData([
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 1],
    [0, 0, 1, 0],
  ]);
  expect(result).not.toBe(image);
});
test('square', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const point = { row: 2, column: 2 };

  const result = image.drawMarker(point, {
    color: [1],
    shape: 'square',
  });
  expect(result).toMatchImageData([
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  expect(result).not.toBe(image);
});
test('big square', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const point = { row: 2, column: 2 };

  const result = image.drawMarker(point, {
    color: [1],
    size: 3,
    shape: 'square',
  });
  expect(result).toMatchImageData([
    [1, 1, 1, 0],
    [1, 0, 1, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
  ]);
  expect(result).not.toBe(image);
});
test('filled big square', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const point = { row: 2, column: 2 };

  const result = image.drawMarker(point, {
    color: [1],
    size: 3,
    filled: true,
    shape: 'square',
  });
  expect(result).toMatchImageData([
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
  ]);
  expect(result).not.toBe(image);
});
test('big triangle', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  const point = { row: 3, column: 2 };

  const result = image.drawMarker(point, {
    color: [1],
    size: 2,
    shape: 'triangle',
  });
  expect(result).toMatchImageData([
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
  ]);
  expect(result).not.toBe(image);
});
test('filled big triangle', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  const point = { row: 3, column: 2 };

  const result = image.drawMarker(point, {
    color: [1],
    size: 2,
    filled: true,
    shape: 'triangle',
  });
  expect(result).toMatchImageData([
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
  ]);
  expect(result).not.toBe(image);
});
test('out parameter set to self', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const point = { row: 2, column: 2 };
  const result = image.drawMarker(point, {
    color: [1],
    shape: 'square',
    out: image,
  });
  expect(result).toMatchImageData([
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  expect(result).toBe(image);
});
test('out to other image', () => {
  const out = new Image(4, 4, { colorModel: 'GREY' });
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const point = { row: 2, column: 2 };
  const result = image.drawMarker(point, {
    color: [1],
    shape: 'square',
    out,
  });
  expect(result).toMatchImageData([
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  expect(result).toBe(out);
  expect(result).not.toBe(image);
});
