import { expect, test } from 'vitest';

import { decode } from '../decode.js';

test('auto decode png', () => {
  const buffer = testUtils.loadBuffer('formats/grey8.png');

  expect(() => decode(buffer)).not.toThrow();

  const decoded = decode(buffer);

  expect(decoded.bitDepth).toBe(8);
  expect(decoded.colorModel).toBe('GREY');
});

test('auto decode jpeg', () => {
  const buffer = testUtils.loadBuffer('formats/rgb12.jpg');

  expect(() => decode(buffer)).not.toThrow();

  const decoded = decode(buffer);

  expect(decoded.bitDepth).toBe(8);
  expect(decoded.colorModel).toBe('RGBA');
});

test('auto decode tiff', () => {
  const buffer = testUtils.loadBuffer('formats/tif/grey8.tif');

  expect(() => decode(buffer)).not.toThrow();

  const decoded = decode(buffer);

  expect(decoded.bitDepth).toBe(8);
  expect(decoded.colorModel).toBe('GREY');
});

test('should throw for too small data', () => {
  expect(() => decode(new Uint8Array(0))).toThrow(
    /invalid data format: undefined/,
  );
});

test('should throw for unknown data', () => {
  expect(() => decode(new Uint8Array(10))).toThrow(
    /invalid data format: undefined/,
  );
});
