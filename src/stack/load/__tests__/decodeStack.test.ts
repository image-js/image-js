import { expect, test } from 'vitest';

import type { TestImagePath } from '../../../../test/TestImagePath.js';
import { decodeStack } from '../decodeStack.js';

test.each([
  {
    name: 'formats/tif/grey8-multi.tif',
    colorModel: 'GREY',
    bitDepth: 8,
    pages: 2,
  },
  {
    name: 'formats/tif/grey16-multi.tif',
    colorModel: 'GREY',
    bitDepth: 16,
    pages: 2,
  },
  {
    name: 'formats/tif/color8-multi.tif',
    colorModel: 'RGB',
    bitDepth: 8,
    pages: 2,
  },
  {
    name: 'formats/tif/color16-multi.tif',
    colorModel: 'RGB',
    bitDepth: 16,
    pages: 2,
  },
  {
    name: 'formats/beachBallApng.png',
    colorModel: 'RGBA',
    bitDepth: 8,
    pages: 20,
  },
  {
    name: 'formats/squareApng.png',
    colorModel: 'RGBA',
    bitDepth: 8,
    pages: 2,
  },
  {
    name: 'formats/testApng.png',
    colorModel: 'GREY',
    bitDepth: 8,
    pages: 2,
  },
])(
  'stacks with multiple images ($colorModel, bitDepth = $bitDepth)',
  (data) => {
    const buffer = testUtils.loadBuffer(data.name as TestImagePath);
    const stack = decodeStack(buffer);

    expect(stack.size).toBe(data.pages);

    for (const image of stack) {
      expect(image.colorModel).toBe(data.colorModel);
      expect(image.bitDepth).toBe(data.bitDepth);
    }
  },
);

test('invalid data format', () => {
  const buffer = testUtils.loadBuffer('formats/grey12.jpg');

  expect(() => decodeStack(buffer)).toThrowError(
    'invalid data format: image/jpeg',
  );
});
