import { expect, test } from 'vitest';

import { rgbToNumber } from '../rgbToNumber.js';

test('white', () => {
  const rgb = new Uint8Array([255, 255, 255]);

  expect(rgbToNumber(rgb)).toBe(0xffffffff);
});

test('red', () => {
  const rgb = new Uint8Array([255, 0, 0]);

  expect(rgbToNumber(rgb)).toBe(0xff0000ff);
});

test('green', () => {
  const rgb = new Uint8Array([0, 255, 0]);

  expect(rgbToNumber(rgb)).toBe(0xff00ff00);
});
