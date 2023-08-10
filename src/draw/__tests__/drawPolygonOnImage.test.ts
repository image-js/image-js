import { Image } from '../../Image';
import { drawPolygonOnImage } from '../drawPolygonOnImage';

test('RGB image', () => {
  const image = testUtils.createRgbImage([
    [100, 150, 200, 100, 150, 0],
    [100, 200, 5, 3, 200, 0],
    [150, 200, 255, 6, 150, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 1, column: 1 },
  ];
  const result = image.drawPolygon(points, { strokeColor: [255, 0, 0] });
  expect(result).toMatchImageData([
    [255, 0, 0, 100, 150, 0],
    [100, 200, 5, 255, 0, 0],
    [150, 200, 255, 6, 150, 0],
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
    { row: 2, column: 0 },
  ];
  const result = image.drawPolygon(points, {
    strokeColor: [255, 0, 0],
    out: image,
  });

  expect(result).toMatchImageData([
    [255, 0, 0, 100, 150, 0],
    [255, 0, 0, 255, 0, 0],
    [255, 0, 0, 6, 150, 0],
  ]);
  expect(result).toBe(image);
});

test('out to other image', () => {
  const out = new Image(2, 3);
  const image = testUtils.createRgbImage([
    [100, 150, 200, 100, 150, 0],
    [100, 200, 5, 3, 200, 0],
    [150, 200, 255, 6, 150, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 1, column: 1 },
    { row: 2, column: 0 },
  ];
  const result = image.drawPolygon(points, {
    strokeColor: [255, 0, 0],
    out,
  });

  expect(result).toMatchImageData([
    [255, 0, 0, 100, 150, 0],
    [255, 0, 0, 255, 0, 0],
    [255, 0, 0, 6, 150, 0],
  ]);
  expect(result).toBe(out);
  expect(result).not.toBe(image);
});

test('drawPolygon with no points', () => {
  const image = testUtils.createRgbImage([
    [100, 150, 200, 100, 150, 0],
    [100, 200, 5, 3, 200, 0],
    [150, 200, 255, 6, 150, 0],
  ]);
  const result = image.drawPolygon([], {
    strokeColor: [255, 0, 0],
  });

  expect(result).toMatchImage(image);
  expect(result).not.toBe(image);
});

test('grey image', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 3, column: 3 },
    { row: 3, column: 0 },
  ];
  const result = image.drawPolygon(points, {
    strokeColor: [1],
    fillColor: [2],
  });

  expect(result).toMatchImageData([
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [1, 2, 1, 0],
    [1, 1, 1, 1],
  ]);
  expect(result).not.toBe(image);
});

test('should handle points with floating values', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 3.1, column: 3.1 },
    { row: 3.1, column: 0 },
  ];
  const result = image.drawPolygon(points, {
    origin: { column: 1.1, row: 1.1 },
    strokeColor: [1],
    fillColor: [2],
  });

  expect(result).toMatchImageData([
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 2, 1, 0],
    [0, 1, 1, 1, 1],
  ]);
  expect(result).not.toBe(image);
});

test('grey image, no fill', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 3, column: 3 },
    { row: 3, column: 0 },
  ];
  const result = image.drawPolygon(points, {
    strokeColor: [1],
  });
  expect(result).toMatchImageData([
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [1, 0, 1, 0],
    [1, 1, 1, 1],
  ]);
  expect(result).not.toBe(image);
});

test('3x3 image, tilted square, filled', () => {
  const image = new Image(3, 3, { colorModel: 'GREY' });
  const points = [
    { column: 0, row: 1 },
    { column: 1, row: 2 },
    { column: 2, row: 1 },
    { column: 1, row: 0 },
  ];

  const result = image.drawPolygon(points, {
    fillColor: [6],
    strokeColor: [3],
  });

  expect(result).toMatchImageData([
    [0, 3, 0],
    [3, 6, 3],
    [0, 3, 0],
  ]);
});

test('5x5 image, tilted square, filled', () => {
  const image = new Image(5, 5, { colorModel: 'GREY' });
  const points = [
    { column: 0, row: 2 },
    { column: 2, row: 4 },
    { column: 4, row: 2 },
    { column: 2, row: 0 },
  ];

  const result = image.drawPolygon(points, {
    fillColor: [6],
    strokeColor: [3],
  });
  expect(result).toMatchImageData([
    [0, 0, 3, 0, 0],
    [0, 3, 6, 3, 0],
    [3, 6, 6, 6, 3],
    [0, 3, 6, 3, 0],
    [0, 0, 3, 0, 0],
  ]);
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
    { row: 3, column: 3 },
    { row: 3, column: 0 },
    { row: 3, column: 0 },
  ];
  const result = image.drawPolygon(points, {
    strokeColor: [1],
    fillColor: [2],
  });

  expect(result).toMatchImageData([
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [1, 2, 1, 0],
    [1, 1, 1, 1],
  ]);
  expect(result).not.toBe(image);
});

test('first and last points are the same', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 3, column: 3 },
    { row: 3, column: 0 },
    { row: 0, column: 0 },
  ];
  const result = image.drawPolygon(points, {
    strokeColor: [1],
    fillColor: [2],
  });

  expect(result).toMatchImageData([
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [1, 2, 1, 0],
    [1, 1, 1, 1],
  ]);
  expect(result).not.toBe(image);
});

test('stroke color not compatible with image', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 3, column: 3 },
    { row: 3, column: 0 },
    { row: 0, column: 0 },
  ];
  expect(() => {
    image.drawPolygon(points, {
      strokeColor: [1],
      fillColor: [2, 5],
    });
  }).toThrow(
    'invalid channel: 2. It must be a positive integer smaller than 2',
  );
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
  const result = drawPolygonOnImage(image, points);

  expect(result).toMatchImageData([
    [0, 10, 10, 10],
    [10, 0, 10, 10],
    [10, 10, 0, 10],
    [10, 10, 10, 0],
  ]);
});

test('different origin', () => {
  const mask = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 0, column: 3 },
    { row: 3, column: 0 },
    { row: 0, column: 0 },
  ];
  const result = mask.drawPolygon(points, {
    origin: { column: 1, row: 0 },
    strokeColor: [1],
    fillColor: [5],
  });
  expect(result).toMatchImageData([
    [0, 1, 1, 1],
    [0, 1, 5, 1],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
  ]);
});

test('outside of image', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 4, column: 4 },
    { row: 4, column: -2 },
  ];
  const result = image.drawPolygon(points, {
    strokeColor: [1],
    fillColor: [2],
  });
  expect(result).toMatchImageData([
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [2, 2, 1, 0],
    [2, 2, 2, 1],
  ]);
  expect(result).not.toBe(image);
});
