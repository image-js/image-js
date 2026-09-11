import { expect, test } from 'vitest';

test('mask AND itself', () => {
  const image = testUtils.createMask([[1, 1, 1, 1, 1, 1, 1, 1]]);
  const other = image;

  expect(image.and(other)).toMatchMaskData([[1, 1, 1, 1, 1, 1, 1, 1]]);
});

test('two different masks', () => {
  const image = testUtils.createMask([[0, 0, 0, 0, 1, 1, 1, 1]]);
  const other = testUtils.createMask([[1, 1, 1, 1, 0, 0, 0, 0]]);

  expect(image.and(other)).toMatchMaskData([[0, 0, 0, 0, 0, 0, 0, 0]]);
});

test('different size error', () => {
  const image = testUtils.createMask([[0, 0, 0, 0, 1, 1, 1, 1]]);
  const other = testUtils.createMask([[1, 1, 1, 0, 0, 0]]);

  expect(() => {
    image.and(other);
  }).toThrow('both masks must have the same size');
});
