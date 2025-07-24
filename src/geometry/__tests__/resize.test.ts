import path from 'node:path';

import { expect, test } from 'vitest';

import type { Image } from '../../Image.js';
import { write } from '../../save/index.js';

async function writeDebug(resized: Image, type: string) {
  // @ts-expect-error Dynamic string.
  const expected = testUtils.load(`opencv/test_resize_${type}.png`);
  await write(
    path.join(import.meta.dirname, `resize_${type}_expected.png`),
    expected,
  );
  await write(
    path.join(import.meta.dirname, `resize_${type}_resized.png`),
    resized,
  );
  const subtraction = expected.subtract(resized);
  await write(
    path.join(import.meta.dirname, `resize_${type}_subtraction.png`),
    subtraction,
  );
}

test('compare with OpenCV (nearest, larger)', async () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({
    xFactor: 10,
    yFactor: 10,
    interpolationType: 'nearest',
  });

  expect(resized).toMatchImage('opencv/test_resize_nearest_larger.png');
});

test('compare with OpenCV (nearest, same size)', async () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({
    xFactor: 1,
    interpolationType: 'nearest',
  });

  expect(resized).toMatchImage('opencv/test_resize_nearest_same.png');
});

test('compare with OpenCV (nearest, smaller)', async () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({
    width: 5,
    height: 6,
    interpolationType: 'nearest',
  });

  expect(resized).toMatchImage('opencv/test_resize_nearest_smaller.png');
});

test.fails('compare with OpenCV (bilinear, larger)', async () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({
    xFactor: 10,
    yFactor: 10,
  });

  await writeDebug(resized, 'bilinear_larger');

  expect(resized).toMatchImage('opencv/test_resize_bilinear_larger.png');
});

test.fails('compare with OpenCV (bilinear, same)', async () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({
    xFactor: 1,
  });

  await writeDebug(resized, 'bilinear_same');

  expect(resized).toMatchImage('opencv/test_resize_bilinear_same.png');
});

test.fails('compare with OpenCV (bilinear, smaller)', async () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({
    width: 5,
    height: 6,
  });

  await writeDebug(resized, 'bilinear_smaller');

  expect(resized).toMatchImage('opencv/test_resize_bilinear_smaller.png');
});

test.fails('compare with OpenCV (bicubic, larger)', async () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({
    xFactor: 10,
    yFactor: 10,
    interpolationType: 'bicubic',
  });

  await writeDebug(resized, 'bicubic_larger');

  expect(resized).toMatchImage('opencv/test_resize_bicubic_larger.png');
});

test.fails('compare with OpenCV (bicubic, same)', async () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({
    xFactor: 1,
    interpolationType: 'bicubic',
  });

  await writeDebug(resized, 'bicubic_same');

  expect(resized).toMatchImage('opencv/test_resize_bicubic_same.png');
});

test.fails('compare with OpenCV (bicubic, smaller)', async () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({
    width: 5,
    height: 6,
    interpolationType: 'bicubic',
  });

  await writeDebug(resized, 'bicubic_smaller');

  expect(resized).toMatchImage('opencv/test_resize_bicubic_smaller.png');
});

test('result should have correct dimensions', () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({
    xFactor: 10,
    yFactor: 10,
  });

  expect(resized.width).toBe(10 * img.width);
  expect(resized.height).toBe(10 * img.height);
});

test('resize to given width and height', () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({
    width: 300,
    height: 100,
  });

  expect(resized.width).toBe(300);
  expect(resized.height).toBe(100);
});

test('aspect ratio not preserved', () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({ preserveAspectRatio: false, height: 50 });

  expect(resized.width).toBe(img.width);
  expect(resized.height).toBe(50);
});

test('xFactor = 2', () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({ xFactor: 2 });

  expect(resized.width).toBe(2 * img.width);
  expect(resized.height).toBe(2 * img.height);
});

test('yFactor = 2', () => {
  const img = testUtils.load('opencv/test.png');

  const resized = img.resize({ yFactor: 2 });

  expect(resized.width).toBe(2 * img.width);
  expect(resized.height).toBe(2 * img.height);
});

test('should throw no parameter', () => {
  const img = testUtils.load('opencv/test.png');

  expect(() => {
    img.resize({});
  }).toThrow(
    'at least one of the width, height, xFactor or yFactor options must be passed',
  );
});

test('should throw factor and size used at the same time', () => {
  const img = testUtils.load('opencv/test.png');

  expect(() => {
    img.resize({ yFactor: 2, height: 50 });
  }).toThrow('factor and size cannot be passed together');
});
