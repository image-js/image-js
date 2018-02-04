import { Image } from 'test/common';

let img;
beforeEach(() => {
  img = new Image(8, 2, {
    kind: 'BINARY'
  });
});

test('size', function () {
  expect(img.width).toBe(8);
  expect(img.height).toBe(2);
  expect(img.size).toBe(16);
  expect(img.data).toHaveLength(2);
});

test('getBit', function () {
  expect(img.getBit(0)).toBe(0);
  expect(img.getBit(15)).toBe(0);
});

test('set / clear bit', function () {
  img.setBit(0);
  img.setBit(15);
  expect(img.getBit(0)).toBe(1);
  expect(img.getBit(15)).toBe(1);
  img.clearBit(0);
  img.clearBit(15);
  expect(img.getBit(0)).toBe(0);
  expect(img.getBit(15)).toBe(0);
});

test('toggle bit', function () {
  img.toggleBit(0);
  img.toggleBit(1);
  expect(img.getBit(0)).toBe(1);
  expect(img.getBit(1)).toBe(1);
  expect(img.getBit(7)).toBe(0);
  img.toggleBit(0);
  img.toggleBit(1);
  expect(img.getBit(0)).toBe(0);
  expect(img.getBit(1)).toBe(0);
  expect(img.getBit(7)).toBe(0);
});

test('getBitXY', function () {
  expect(img.getBitXY(0, 0)).toBe(0);
  expect(img.getBitXY(7, 1)).toBe(0);
});

test('set XY / clear XY bit', function () {
  img.setBitXY(0, 0);
  img.setBitXY(7, 1);
  expect(img.getBitXY(0, 0)).toBe(1);
  expect(img.getBitXY(7, 1)).toBe(1);
  img.clearBitXY(0, 0);
  img.clearBitXY(7, 1);
  expect(img.getBitXY(0, 0)).toBe(0);
  expect(img.getBitXY(7, 1)).toBe(0);
});

test('toggle XY bit', function () {
  img.toggleBitXY(0, 0);
  img.toggleBitXY(4, 1);
  expect(img.getBitXY(0, 0)).toBe(1);
  expect(img.getBitXY(4, 1)).toBe(1);
  expect(img.getBitXY(7, 1)).toBe(0);
  img.toggleBitXY(0, 0);
  img.toggleBitXY(4, 1);
  expect(img.getBitXY(0, 0)).toBe(0);
  expect(img.getBitXY(4, 1)).toBe(0);
  expect(img.getBitXY(7, 1)).toBe(0);
});
