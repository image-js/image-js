import { fromMask } from '..';
import { Mask } from '../..';

test('3x3 mask, cross', () => {
  const mask = testUtils.createMask([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);
  const expected = [
    [-1, 1, -3],
    [1, 1, 1],
    [-2, 1, -4],
  ];
  expect(fromMask(mask).getMapMatrix()).toStrictEqual(expected);
});

test('3x3 mask, stripes', () => {
  const mask = testUtils.createMask([
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ]);
  const expected = [
    [-1, 1, -2],
    [-1, 1, -2],
    [-1, 1, -2],
  ];

  expect(fromMask(mask).getMapMatrix()).toStrictEqual(expected);
});

test('5x5 mask, ring', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ]);
  const expected = [
    [-1, -1, -1, -1, -1],
    [-1, 1, 1, 1, -1],
    [-1, 1, -2, 1, -1],
    [-1, 1, 1, 1, -1],
    [-1, -1, -1, -1, -1],
  ];

  expect(fromMask(mask).getMapMatrix()).toStrictEqual(expected);
});

test('5x5 mask, test left connection', () => {
  const mask = testUtils.createMask([
    [0, 0, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  const expected = [
    [-1, -1, 1, -1, -1],
    [-1, -1, 1, 1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
  ];

  expect(fromMask(mask).getMapMatrix()).toStrictEqual(expected);
});

test('5x5 mask, test top-left connection', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 1, 0],
  ]);
  const expected = [
    [-1, -1, -1, -1, -1],
    [-1, 1, 1, 1, -1],
    [-1, -1, -1, 1, -1],
    [-1, 1, -1, 1, -1],
    [-1, -1, 1, 1, -1],
  ];

  expect(fromMask(mask, { allowCorners: true }).getMapMatrix()).toStrictEqual(
    expected,
  );
});

test('6x6 mask, allowCorners false', () => {
  const mask = testUtils.createMask([
    [0, 1, 0, 1, 0, 1],
    [0, 0, 1, 1, 0, 1],
    [0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
  const expected = [
    [-1, 1, -2, 4, -3, 6],
    [-1, -1, 4, 4, -3, 6],
    [-1, 2, -1, -1, 5, -4],
    [-1, -1, -1, -1, -1, 7],
    [-1, 3, 3, 3, -1, -1],
    [-1, -1, -1, -1, -1, -1],
  ];

  const roiMapManager = fromMask(mask);
  expect(roiMapManager.getMapMatrix()).toStrictEqual(expected);
  expect(roiMapManager.getMap().nbNegative).toBe(4);
  expect(roiMapManager.getMap().nbPositive).toBe(7);
});

test('6x6 mask, allowCorners true', () => {
  const mask = testUtils.createMask([
    [0, 1, 0, 1, 0, 1],
    [0, 0, 1, 1, 0, 1],
    [0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
  const expected = [
    [-1, 1, -1, 1, -1, 1],
    [-1, -1, 1, 1, -1, 1],
    [-1, 1, -1, -1, 1, -1],
    [-1, -1, -1, -1, -1, 1],
    [-1, 2, 2, 2, -1, -1],
    [-1, -1, -1, -1, -1, -1],
  ];

  expect(fromMask(mask, { allowCorners: true }).getMapMatrix()).toStrictEqual(
    expected,
  );
});

test('exceed max number of ROIs error', () => {
  const size = 513;
  let mask = new Mask(size, size);
  let pos = true;
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (pos) mask.setBit(column, row, 1);
      pos = !pos;
    }
  }
  expect(() => {
    fromMask(mask);
  }).toThrow(/Too many regions of interest/);
});
