import { Image } from '../../Image';
import { drawPoints } from '../drawPoints';

test('RGB image', () => {
  const image = testUtils.createRgbImage([
    [100, 150, 200, 100, 150, 200],
    [100, 150, 200, 100, 150, 200],
    [100, 150, 200, 100, 150, 200],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 1, column: 1 },
  ];

  const result = image.drawPoints(points, { color: [255, 0, 0] });
  expect(result).toMatchImageData([
    [255, 0, 0, 100, 150, 200],
    [100, 150, 200, 255, 0, 0],
    [100, 150, 200, 100, 150, 200],
  ]);
  expect(result).not.toBe(image);
});

test('GREY image', () => {
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
  const result = image.drawPoints(points, {
    color: [1],
  });

  expect(result).toMatchImageData([
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 0, 0, 1],
  ]);
  expect(result).not.toBe(image);
});

test('floating point values', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 2.99, column: 2.8 },
    { row: 2.9, column: 0 },
  ];
  const result = image.drawPoints(points, {
    color: [1],
  });

  expect(result).toMatchImageData([
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 0, 0, 1],
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
    { row: 0, column: 0 },
    { row: 1, column: 1 },
    { row: 2, column: 2 },
  ];
  const result = image.drawPoints(points, {
    color: [1],
    out: image,
  });

  expect(result).toMatchImageData([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0],
  ]);
  expect(result).toBe(image);
});

test('out parameter set to self (mask)', () => {
  const image = testUtils.createMask([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 1, column: 1 },
    { row: 2, column: 2 },
  ];
  const result = image.drawPoints(points, {
    color: [1],
    out: image,
  });

  expect(result).toMatchImageData([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
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
  const points = [
    { row: 0, column: 0 },
    { row: 1, column: 0 },
    { row: 2, column: 0 },
  ];
  const result = image.drawPoints(points, {
    color: [1],
    out,
  });

  expect(result).toBe(out);
  expect(result).not.toBe(image);
});

test('mask', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 1, column: 0 },
    { row: 0, column: 1 },
  ];
  const result = mask.drawPoints(points);
  expect(result).toMatchMaskData([
    [1, 1, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  expect(result).not.toBe(mask);
});

test('default options', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 2, column: 2 },
    { row: 2, column: 0 },
    { row: 0, column: 2 },
  ];
  const result = drawPoints(mask, points);
  expect(result).toMatchMaskData([
    [0, 0, 1, 0],
    [0, 0, 0, 0],
    [1, 0, 1, 0],
    [0, 0, 0, 0],
  ]);
  expect(result).not.toBe(mask);
});

test('different origin', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: -1, column: -1 },
    { row: -1, column: 0 },
    { row: 0, column: 1 },
    { row: 0, column: 0 },
  ];
  const result = drawPoints(mask, points, { origin: { column: 2, row: 2 } });
  expect(result).toMatchMaskData([
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
  ]);
  expect(result).not.toBe(mask);
});

test('points outside mask', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: -1, column: -1 },
    { row: -1, column: 0 },
    { row: 0, column: 1 },
    { row: 0, column: 0 },
    { row: 2, column: 6 },
  ];
  const result = drawPoints(mask, points);
  expect(result).toMatchMaskData([
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  expect(result).not.toBe(mask);
});
