import { expect, test } from 'vitest';

import { Image } from '../../Image.js';

test('square', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 1, column: 1 },
    { row: 2, column: 2 },
    { row: 3, column: 2 },
  ];

  const result = image.drawMarkers(points, {
    strokeColor: [1],
    shape: 'square',
  });

  expect(result).toMatchImageData([
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ]);
  expect(result).not.toBe(image);
});

test('cross', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 1, column: 1 },
    { row: 2, column: 2 },
  ];

  const result = image.drawMarkers(points, { strokeColor: [1] });

  expect(result).toMatchImageData([
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 1, 1, 1],
    [0, 0, 1, 0],
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
  const points = [
    { row: 1, column: 1 },
    { row: 2, column: 2 },
    { row: 3, column: 2 },
  ];
  const result = image.drawMarkers(points, {
    strokeColor: [1],
    shape: 'square',
    out: image,
  });

  expect(result).toMatchImageData([
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
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
  const points = [
    { row: 1, column: 1 },
    { row: 2, column: 2 },
    { row: 3, column: 2 },
  ];
  const result = image.drawMarkers(points, {
    strokeColor: [1],
    shape: 'square',
    out,
  });

  expect(result).toMatchImageData([
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ]);
  expect(result).toBe(out);
  expect(result).not.toBe(image);
});
