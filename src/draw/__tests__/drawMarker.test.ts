import { expect, test } from 'vitest';

import { Image } from '../../Image.js';

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
    [0, 0, 0, 0],
    [0, 0, 1, 0],
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
    [0, 0, 0, 0],
    [0, 1, 1, 1],
    [0, 1, 0, 1],
    [0, 1, 1, 1],
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
    [0, 0, 0, 0],
    [0, 1, 1, 1],
    [0, 1, 1, 1],
    [0, 1, 1, 1],
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
    [0, 0, 0, 0],
    [0, 0, 1, 0],
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
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0],
  ]);
  expect(result).toBe(out);
  expect(result).not.toBe(image);
});

test('should handle points with floating values', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
  const point = { row: 3.1, column: 3.1 };

  const square = image.drawMarker(point, {
    color: [1],
    size: 3.1,
    filled: true,
    shape: 'square',
  });

  expect(square).toMatchImageData([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0],
  ]);

  const triangle = image.drawMarker(point, {
    color: [1],
    size: 2.1,
    filled: true,
    shape: 'triangle',
  });

  expect(triangle).toMatchImageData([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]);

  const circle = image.drawMarker(point, {
    color: [1],
    size: 2.1,
    filled: true,
    shape: 'circle',
  });

  expect(circle).toMatchImageData([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 0],
  ]);

  const cross = image.drawMarker(point, {
    color: [1],
    size: 2.1,
    filled: true,
    shape: 'cross',
  });

  expect(cross).toMatchImageData([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 0],
  ]);
});
