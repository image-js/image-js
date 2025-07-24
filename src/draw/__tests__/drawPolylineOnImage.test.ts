import { expect, test } from 'vitest';

import { Image } from '../../Image.js';
import { drawPolylineOnImage } from '../drawPolylineOnImage.js';

test('RGB image', () => {
  const image = testUtils.createRgbImage([
    [100, 150, 200, 100, 150, 0],
    [100, 200, 5, 3, 200, 0],
    [150, 200, 255, 6, 150, 0],
  ]);
  const points = [
    { row: 1, column: 0 },
    { row: 2, column: 1 },
  ];
  const result = image.drawPolyline(points, { strokeColor: [255, 0, 0] });

  expect(result).toMatchImageData([
    [100, 150, 200, 100, 150, 0],
    [255, 0, 0, 3, 200, 0],
    [150, 200, 255, 255, 0, 0],
  ]);
  expect(result).not.toBe(image);
});

test('out parameter set to self', () => {
  const image = testUtils.createRgbImage([
    [100, 150, 200, 100, 150, 0],
    [100, 200, 5, 3, 200, 0],
    [150, 200, 255, 6, 150, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 1, column: 1 },
    { row: 0, column: 1 },
  ];
  const result = image.drawPolyline(points, {
    strokeColor: [255, 0, 0],
    out: image,
  });

  expect(result).toMatchImageData([
    [255, 0, 0, 255, 0, 0],
    [100, 200, 5, 255, 0, 0],
    [150, 200, 255, 6, 150, 0],
  ]);
  expect(result).toBe(image);
});

test('out to other image', () => {
  const out = new Image(2, 4);
  const image = testUtils.createRgbImage([
    [100, 150, 200, 100, 150, 0],
    [100, 200, 5, 3, 200, 0],
    [150, 200, 255, 6, 150, 0],
    [150, 200, 255, 6, 150, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 1, column: 1 },
    { row: 2, column: 1 },
  ];
  const result = image.drawPolyline(points, {
    strokeColor: [255, 0, 0],
    out,
  });

  expect(result).toMatchImageData([
    [255, 0, 0, 100, 150, 0],
    [100, 200, 5, 255, 0, 0],
    [150, 200, 255, 255, 0, 0],
    [150, 200, 255, 6, 150, 0],
  ]);
  expect(result).toBe(out);
  expect(result).not.toBe(image);
});

test('should handle duplicate points', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 0, column: 0 },
    { row: 3, column: 0 },
    { row: 3, column: 2 },
    { row: 3, column: 2 },
  ];
  const result = image.drawPolyline(points, { strokeColor: [1] });

  expect(result).toMatchImageData([
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
  ]);
  expect(result).not.toBe(image);
});

test('default options', () => {
  const image = testUtils.createGreyImage([
    [10, 10, 10, 10],
    [10, 10, 10, 10],
    [10, 10, 10, 10],
    [10, 10, 10, 10],
  ]);

  const points = [
    { row: 0, column: 0 },
    { row: image.height, column: image.width },
  ];
  const result = drawPolylineOnImage(image, points);

  expect(result).toMatchImageData([
    [0, 10, 10, 10],
    [10, 0, 10, 10],
    [10, 10, 0, 10],
    [10, 10, 10, 0],
  ]);
});

test('different origin', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 1, column: 0 },
    { row: 1, column: 1 },
  ];
  let result = image.drawPolyline(points, {
    origin: { column: 1, row: 0 },
    strokeColor: [1],
  });

  expect(result).toMatchImageData([
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  result = image.drawPolyline(points, {
    origin: { column: 3, row: 0 },
    strokeColor: [1],
  });

  expect(result).toMatchImageData([
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
});

test('should handle points with floating values', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 0.1, column: 0.1 },
    { row: 1.1, column: 0.1 },
    { row: 1.1, column: 1.1 },
  ];
  const result = image.drawPolyline(points, {
    origin: { column: 2.1, row: 0.1 },
    strokeColor: [1],
  });

  expect(result).toMatchImageData([
    [0, 0, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
});
