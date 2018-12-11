import { Image, load } from 'test/common';

import { createCanvas } from 'canvas';

test('constructor defaults', () => {
  let img = new Image();
  expect(img.width).toBe(1);
  expect(img.height).toBe(1);
  expect(img.data).toHaveLength(4);
});

test('invalid constructor use', () => {
  expect(() => new Image(0, 0)).toThrow(/width must be a positive integer/);
  expect(() => new Image(5, 0)).toThrow(/height must be a positive integer/);
  expect(() => new Image(10, 10, { kind: 'BLABLA' })).toThrow(/invalid image kind: BLABLA/);
  expect(() => new Image(10, 10, 10)).toThrow(/options must be an object/);
  expect(() => new Image({ kind: 42 })).toThrow(/kind must be a string/);
});

test('construct with a kind', () => {
  const img = new Image(1, 1, { kind: 'RGB' });
  expect(img.data).toHaveLength(3);
});

test('construct a 32bit image', () => {
  const img = new Image(1, 1, { bitDepth: 32 });
  expect(img.bitDepth).toBe(32);
  expect(img.data).toBeInstanceOf(Float32Array);
  expect(img.maxValue).toBe(Number.MAX_VALUE);
});

test('create from Canvas', () => {
  let canvas = createCanvas(2, 2);
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 2, 1);
  let img = Image.fromCanvas(canvas);
  expect(Array.from(img.data)).toStrictEqual([
    255,   0,   0, 255, 255,   0,   0, 255,
    0,     0,   0,   0,   0,   0,   0,   0
  ]);
});

test('clone', async () => {
  const img = await load('format/png/rgba32.png');
  const clone = img.clone();
  expect(clone).toBeInstanceOf(Image);
  expect(clone).not.toBe(img);
  expect(clone.data).not.toBe(img.data);
  expect(clone.toDataURL()).toBe(img.toDataURL());
});

test('toString', () => {
  const image = new Image();
  expect(image.toString()).toBe('[object IJSImage]');
});
