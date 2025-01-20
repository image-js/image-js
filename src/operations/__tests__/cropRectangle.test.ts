import type { Image } from '../../Image.js';
import { rotatePoint } from '../../point/operations.js';
import type { Point } from '../../utils/geometry/points.js';
import { assert } from '../../utils/validators/assert.js';

test('straight rectangle top left', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
  const points = testUtils.createPoints([0, 0], [2, 0], [2, 2], [0, 2]);

  const result = image.cropRectangle(points, { interpolationType: 'nearest' });
  expect(result).toMatchImage(
    testUtils.createGreyImage([
      [1, 2],
      [4, 5],
    ]),
  );
});

test('straight rectangle bottom right', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
  const points = testUtils.createPoints([1, 3], [3, 3], [3, 1], [1, 1]);

  const result = image.cropRectangle(points);
  expect(result).toMatchImage(
    testUtils.createGreyImage([
      [5, 6],
      [8, 9],
    ]),
  );
});

test('vertical rectangle with small angle', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
  const points = testUtils
    .createPoints([1.5, 0], [2.5, 0], [2.5, 3], [1.5, 3])
    .map((p) => rotatePoint(p, { row: 1.5, column: 1.5 }, 0.1));

  const expected = testUtils.createGreyImage([[3], [6], [8]]);
  expectCropRectangleToMatch({
    image,
    expected,
    points,
  });
});

test('horizontal rectangle with small angle', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
  const points = testUtils
    .createPoints([0, 1.5], [3, 1.5], [3, 2.5], [0, 2.5])
    .map((p) => rotatePoint(p, { row: 1.5, column: 1.5 }, 0.1));

  const expected = testUtils.createGreyImage([[4, 5, 9]]);
  expectCropRectangleToMatch({
    image,
    expected,
    points,
  });
});

test('diagonal rectangle oriented slightly > 45 degrees clockwise', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
  const points = testUtils
    .createPoints([1.5, 0], [2.5, 0], [2.5, 3], [1.5, 3])
    .map((p) => rotatePoint(p, { row: 1.5, column: 1.5 }, Math.PI / 4 + 0.01));

  // Resulting image is horizontal because the rectangle is closer to the horizontal axis than the vertical one
  const expected = testUtils.createGreyImage([[0, 8, 6]]);
  expectCropRectangleToMatch({
    image,
    expected,
    points,
  });
});

test('diagonal rectangle oriented slightly below 45 degrees', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);

  const points = testUtils
    .createPoints([1.5, 0], [2.5, 0], [2.5, 3], [1.5, 3])
    .map((p) => rotatePoint(p, { row: 1.5, column: 1.5 }, Math.PI / 4 - 0.01));

  // Resulting image is vertical because the rectangle is closer to the vertical axis than the horizontal one
  const expected = testUtils.createGreyImage([[0], [6], [8]]);
  expectCropRectangleToMatch({
    image,
    expected,
    points,
  });
});

function expectCropRectangleToMatch(options: {
  image: Image;
  expected: Image;
  points: Point[];
}) {
  const { image, expected, points } = options;
  assert(options.points.length === 4, 'Expected to receive 4 points');
  const variants: Point[][] = [];
  const pointsReversed = points.slice().reverse();
  for (let i = 0; i < 4; i++) {
    const variant: Point[] = [];
    variants.push(variant);
    for (let j = 0; j < 4; j++) {
      variant.push(points[(i + j) % 4]);
    }
  }
  for (let i = 0; i < 4; i++) {
    const variant: Point[] = [];
    variants.push(variant);
    for (let j = 0; j < 4; j++) {
      variant.push(pointsReversed[(i + j) % 4]);
    }
  }

  for (const points of variants) {
    const result = image.cropRectangle(points, {
      interpolationType: 'nearest',
    });
    expect(result).toMatchImage(expected);
  }
}
