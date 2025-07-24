import { expect, test } from 'vitest';

test('3x3 mask, default options', () => {
  const destMask = testUtils.createMask([
    [1, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const mask = testUtils.createMask([
    [0, 1],
    [1, 0],
  ]);
  const result = destMask.paintMask(mask);

  expect(result).toMatchMaskData([
    [1, 1, 0],
    [1, 0, 0],
    [0, 0, 0],
  ]);
  expect(result).not.toBe(destMask);
});

test('3x3 mask, offset', () => {
  const destMask = testUtils.createMask([
    [1, 0, 0],
    [1, 0, 1],
    [1, 0, 0],
  ]);
  const mask = testUtils.createMask([
    [0, 1],
    [1, 0],
  ]);
  const result = destMask.paintMask(mask, { origin: { column: 1, row: 0 } });

  expect(result).toMatchMaskData([
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
  ]);
});

test('3x3 mask, negative offset', () => {
  const destMask = testUtils.createMask([
    [0, 0, 0],
    [0, 0, 0],
    [0, 1, 1],
  ]);
  const mask = testUtils.createMask([
    [0, 1, 1],
    [1, 0, 1],
  ]);
  const result = destMask.paintMask(mask, { origin: { column: -1, row: 0 } });

  expect(result).toMatchMaskData([
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ]);
});

test('3x3 mask, custom value', () => {
  const destMask = testUtils.createMask([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]);
  const mask = testUtils.createMask([
    [1, 1],
    [1, 0],
  ]);
  const result = destMask.paintMask(mask, { value: 0 });

  expect(result).toMatchImageData([
    [0, 0, 1],
    [0, 1, 1],
    [1, 1, 1],
  ]);
});

test('out option', () => {
  const destMask = testUtils.createMask([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const mask = testUtils.createMask([[1]]);
  destMask.paintMask(mask, {
    out: destMask,
  });

  expect(destMask).toMatchMaskData([
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
});
