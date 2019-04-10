import { BorderType } from 'ijs';

import { interpolateBorder } from '../../src/utils/interpolateBorder';

test('in range', () => {
  expect(interpolateBorder(0, 10, BorderType.REFLECT)).toBe(0);
  expect(interpolateBorder(1, 10, BorderType.REFLECT)).toBe(1);
  expect(interpolateBorder(5, 10, BorderType.REFLECT)).toBe(5);
  expect(interpolateBorder(9, 10, BorderType.REFLECT)).toBe(9);
});

test('too far', () => {
  const exp = /interpolateBorder only supports borders smaller than the original image/;
  expect(() => interpolateBorder(-10, 10, BorderType.REFLECT)).toThrow(exp);
  expect(() => interpolateBorder(19, 10, BorderType.REFLECT)).toThrow(exp);
  expect(() => interpolateBorder(-110, 10, BorderType.REFLECT)).toThrow(exp);
  expect(() => interpolateBorder(200, 10, BorderType.REFLECT)).toThrow(exp);
});

test('CONSTANT', () => {
  expect(interpolateBorder(-4, 10, BorderType.CONSTANT)).toStrictEqual(-1);
  expect(interpolateBorder(0, 10, BorderType.CONSTANT)).toStrictEqual(0);
  expect(interpolateBorder(1, 10, BorderType.CONSTANT)).toStrictEqual(1);
  expect(interpolateBorder(-200, 10, BorderType.CONSTANT)).toStrictEqual(-1);
  expect(interpolateBorder(200, 10, BorderType.CONSTANT)).toStrictEqual(-1);
});

test('REPLICATE - negative', () => {
  expect(interpolateBorder(-1, 10, BorderType.REPLICATE)).toBe(0);
  expect(interpolateBorder(-2, 10, BorderType.REPLICATE)).toBe(0);
  expect(interpolateBorder(-8, 10, BorderType.REPLICATE)).toBe(0);
  expect(interpolateBorder(-9, 10, BorderType.REPLICATE)).toBe(0);
});

test('REPLICATE - positive', () => {
  expect(interpolateBorder(10, 10, BorderType.REPLICATE)).toBe(9);
  expect(interpolateBorder(11, 10, BorderType.REPLICATE)).toBe(9);
  expect(interpolateBorder(17, 10, BorderType.REPLICATE)).toBe(9);
  expect(interpolateBorder(18, 10, BorderType.REPLICATE)).toBe(9);
});

test('REFLECT - negative', () => {
  expect(interpolateBorder(-1, 10, BorderType.REFLECT)).toBe(0);
  expect(interpolateBorder(-2, 10, BorderType.REFLECT)).toBe(1);
  expect(interpolateBorder(-8, 10, BorderType.REFLECT)).toBe(7);
  expect(interpolateBorder(-9, 10, BorderType.REFLECT)).toBe(8);
});

test('REFLECT - positive', () => {
  expect(interpolateBorder(10, 10, BorderType.REFLECT)).toBe(9);
  expect(interpolateBorder(11, 10, BorderType.REFLECT)).toBe(8);
  expect(interpolateBorder(17, 10, BorderType.REFLECT)).toBe(2);
  expect(interpolateBorder(18, 10, BorderType.REFLECT)).toBe(1);
});

test('WRAP - negative', () => {
  expect(interpolateBorder(-1, 10, BorderType.WRAP)).toBe(9);
  expect(interpolateBorder(-2, 10, BorderType.WRAP)).toBe(8);
  expect(interpolateBorder(-8, 10, BorderType.WRAP)).toBe(2);
  expect(interpolateBorder(-9, 10, BorderType.WRAP)).toBe(1);
});

test('WRAP - positive', () => {
  expect(interpolateBorder(10, 10, BorderType.WRAP)).toBe(0);
  expect(interpolateBorder(11, 10, BorderType.WRAP)).toBe(1);
  expect(interpolateBorder(17, 10, BorderType.WRAP)).toBe(7);
  expect(interpolateBorder(18, 10, BorderType.WRAP)).toBe(8);
});

test('REFLECT_101 - negative', () => {
  expect(interpolateBorder(-1, 10, BorderType.REFLECT_101)).toBe(1);
  expect(interpolateBorder(-2, 10, BorderType.REFLECT_101)).toBe(2);
  expect(interpolateBorder(-8, 10, BorderType.REFLECT_101)).toBe(8);
  expect(interpolateBorder(-9, 10, BorderType.REFLECT_101)).toBe(9);
});

test('REFLECT_101 - positive', () => {
  expect(interpolateBorder(10, 10, BorderType.REFLECT_101)).toBe(8);
  expect(interpolateBorder(11, 10, BorderType.REFLECT_101)).toBe(7);
  expect(interpolateBorder(17, 10, BorderType.REFLECT_101)).toBe(1);
  expect(interpolateBorder(18, 10, BorderType.REFLECT_101)).toBe(0);
});
