import { expect, test } from 'vitest';

import { Image } from '../../../Image.js';
import {
  getCirclePoints,
  getCompassPoints,
  getFilledCirclePoints,
  getLinePoints,
} from '../getCirclePoints.js';

test('circle with radius 1', () => {
  expect(getCirclePoints(1)).toStrictEqual([
    { row: 0, column: 1 },
    { row: 1, column: 0 },
    { row: 0, column: -1 },
    { row: -1, column: 0 },
  ]);
});

test('circle with radius 2', () => {
  const expected = [
    { row: 0, column: 2 },
    { row: 1, column: 2 },
    { row: 2, column: 1 },
    { row: 2, column: 0 },
    { row: 2, column: -1 },
    { row: 1, column: -2 },
    { row: 0, column: -2 },
    { row: -1, column: -2 },
    { row: -2, column: -1 },
    { row: -2, column: 0 },
    { row: -2, column: 1 },
    { row: -1, column: 2 },
  ];

  const result = getCirclePoints(2);

  expect(result).toStrictEqual(expected);
});

test('circle with radius 3', () => {
  const expected = [
    { row: 0, column: 3 },
    { row: 1, column: 3 },
    { row: 2, column: 2 },
    { row: 3, column: 1 },
    { row: 3, column: 0 },
    { row: 3, column: -1 },
    { row: 2, column: -2 },
    { row: 1, column: -3 },
    { row: 0, column: -3 },
    { row: -1, column: -3 },
    { row: -2, column: -2 },
    { row: -3, column: -1 },
    { row: -3, column: 0 },
    { row: -3, column: 1 },
    { row: -2, column: 2 },
    { row: -1, column: 3 },
  ];

  const result = getCirclePoints(3);

  expect(result).toStrictEqual(expected);
});

test('compass points, radius 1', () => {
  expect(getCompassPoints(1)).toStrictEqual([
    { row: 0, column: 1 },
    { row: 1, column: 0 },
    { row: 0, column: -1 },
    { row: -1, column: 0 },
  ]);
});

test('horizonal line', () => {
  expect(
    getLinePoints({ column: 0, row: 0 }, { column: 2, row: 0 }),
  ).toStrictEqual([
    { row: 0, column: 0 },
    { row: 0, column: 1 },
    { row: 0, column: 2 },
  ]);
});

test('filled circle with radius 1', () => {
  const points = getFilledCirclePoints(1, { column: 0, row: 0 });

  expect(points).toHaveLength(5);
  expect(points).toStrictEqual([
    { row: 0, column: -1 },
    { row: -1, column: 0 },
    { row: 0, column: 0 },
    { row: 1, column: 0 },
    { row: 0, column: 1 },
  ]);
});

test('filled circle with radius 0', () => {
  expect(getFilledCirclePoints(0, { column: 0, row: 0 })).toStrictEqual([
    { row: 0, column: 0 },
  ]);
});

test('filled circle with radius 5', () => {
  const emptyImage = new Image(11, 11, { colorModel: 'GREY' });
  const center = { row: 5, column: 5 };

  const points = getFilledCirclePoints(5, center);

  expect(
    emptyImage.drawPoints(points, { color: [255] }),
  ).toMatchImageSnapshot();

  expect(emptyImage.drawPoints(points, { color: [255] })).toMatchImage(
    emptyImage.drawCircle(center, 5, { fill: [255], color: [255] }),
  );
});

test('check for points twice in array', () => {
  const emptyImage = new Image(5, 5, { colorModel: 'GREY' });
  const points = getFilledCirclePoints(2, { column: 2, row: 2 });

  expect(points).toHaveLength(21);
  expect(
    emptyImage.drawPoints(points, { color: [255] }),
  ).toMatchImageSnapshot();
});
