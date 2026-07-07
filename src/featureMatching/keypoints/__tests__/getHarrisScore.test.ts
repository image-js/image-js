import { expect, test } from 'vitest';

import { Image } from '../../../Image.js';
import { getHarrisScore } from '../getHarrisScore.js';

const fastRadius = 3;
const fastDiameter = 2 * fastRadius + 1;

test('7x7 image, full of zeros', () => {
  const image = new Image(fastDiameter, fastDiameter, {
    colorModel: 'GREY',
  });

  const origin = { row: fastRadius, column: fastRadius };

  const result = getHarrisScore(image, origin);

  expect(result).toBe(0);
});

test('7x7 image with one point', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 255, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const point1 = { column: 4, row: 4 };
  const score1 = getHarrisScore(image, point1, { windowSize: 5 });

  expect(score1).toBeCloseTo(511449195600);
});

test('7x7 image with horizontal line', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 55, 0, 0, 0, 0, 0, 0],
    [0, 0, 55, 55, 0, 0, 0, 0, 0],
    [0, 0, 55, 0, 55, 0, 0, 0, 0],
    [0, 0, 55, 0, 0, 55, 0, 0, 0],
    [0, 0, 55, 55, 55, 55, 55, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const matrixSize = 5;
  const matrix = Array.from({ length: matrixSize }, () =>
    new Array(matrixSize).fill(0),
  );
  for (let i = 0; i < matrixSize; i++) {
    for (let j = 0; j < matrixSize; j++) {
      const point = { column: j + 2, row: i + 2 };
      matrix[i][j] = getHarrisScore(image, point, { windowSize: 3 });
    }
  }

  expect(matrix).toBeDeepCloseTo([
    [9452229600.000004, 4405476900, -60028100, -52707600, -1464099.9999999998],
    [12468275600, 6242922399.999999, 2915023100.0000014, -177156100, -52707600],
    [4603130399.999998, 4392300000.000001, 6279524900, 2915023100, -60028100],
    [5972063899.999995, 3074610000, 4392300000.000001, 6242922400, 4405476900],
    [8976397100, 5972063900.000001, 4603130400, 12468275600, 9452229600.000002],
  ]);
});

test('9x9 image with triangle', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 55, 0, 0, 0, 0],
    [0, 0, 0, 55, 0, 55, 0, 0, 0],
    [0, 0, 55, 55, 55, 55, 55, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const origin2 = { row: 4, column: 6 };
  const origin3 = { row: 4, column: 2 };
  const windowSize = 3;
  const result2 = getHarrisScore(image, origin2, { windowSize });
  const result3 = getHarrisScore(image, origin3, { windowSize });

  expect(result2).toBeCloseTo(result3);
});

test('7x7 image with corner 90 degrees, bottom-right', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 255, 255, 255, 255],
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
  ]);

  const origin = { row: fastRadius, column: fastRadius };

  const result = getHarrisScore(image, origin);

  expect(result).toBeCloseTo(18079323152400);
});

test('7x7 image with corner 90 degrees, top-right', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 255, 255, 255],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]);

  const origin = { row: fastRadius, column: fastRadius };

  const result = getHarrisScore(image, origin);

  expect(result).toBeCloseTo(18079323152400);
});

test('7x7 image with corner 90 degrees, bottom-left', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [255, 255, 255, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
  ]);

  const origin = { row: fastRadius, column: fastRadius };

  const result = getHarrisScore(image, origin);

  expect(result).toBeCloseTo(18079323152400);
});

test('7x7 image with corner 90 degrees, top-left', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
    [0, 0, 0, 255, 0, 0, 0],
    [255, 255, 255, 255, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]);

  const origin = { row: fastRadius, column: fastRadius };

  const result = getHarrisScore(image, origin);

  expect(result).toBeCloseTo(18079323152400);
});

test('7x7 image with other corner', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 50, 0, 0, 0],
    [0, 0, 50, 0, 50, 0, 0],
    [0, 50, 0, 0, 0, 50, 0],
    [50, 0, 0, 0, 0, 0, 50],
  ]);

  const origin = { row: fastRadius, column: fastRadius };

  const result = getHarrisScore(image, origin);

  expect(result).toBeCloseTo(6404000000);
});

test('x-mark', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 50, 0, 50, 0, 0],
    [0, 0, 0, 50, 0, 0, 0],
    [0, 0, 50, 0, 50, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]);

  const origin = { row: 3, column: 3 };
  const result = getHarrisScore(image, origin, { windowSize: 3 });

  expect(result).toBeCloseTo(756000000);
});

test('7x7 image with darker and lighter areas', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 50, 0, 0, 0],
    [0, 0, 0, 50, 50, 0, 0],
    [0, 0, 50, 100, 100, 50, 0],
    [0, 50, 100, 100, 100, 100, 50],
  ]);

  const origin = { row: fastRadius, column: fastRadius };

  const result = getHarrisScore(image, origin, { windowSize: 5 });

  expect(result).toBeCloseTo(256121000000);
});

test('7x7 image with segment', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 200, 0, 0, 0],
    [0, 0, 0, 100, 0, 0, 0],
    [0, 0, 0, 100, 0, 0, 0],
    [0, 0, 0, 100, 0, 0, 0],
  ]);

  const origin = { row: fastRadius, column: fastRadius };

  const result = getHarrisScore(image, origin, { windowSize: 5 });

  expect(result).toBeCloseTo(380096000000);
});

test('windowSize error', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 200, 0, 0, 0],
    [0, 0, 0, 100, 0, 0, 0],
    [0, 0, 0, 100, 0, 0, 0],
    [0, 0, 0, 100, 0, 0, 0],
  ]);

  const origin = { row: fastRadius, column: fastRadius };

  expect(() => getHarrisScore(image, origin, { windowSize: 6 })).toThrowError(
    'windowSize must be an odd integer',
  );
});
