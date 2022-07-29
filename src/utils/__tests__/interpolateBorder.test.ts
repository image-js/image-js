import { Image } from '../../Image';
import {
  BorderType,
  getBorderInterpolation,
  interpolateConstantPoint,
  interpolateReflectPoint,
  interpolateReplicatePoint,
  interpolateWrapPoint,
  interpolateReflect101Point,
} from '../interpolateBorder';

test('in range', () => {
  expect(interpolateReflectPoint(0, 10)).toBe(0);
  expect(interpolateReflectPoint(1, 10)).toBe(1);
  expect(interpolateReflectPoint(5, 10)).toBe(5);
  expect(interpolateReflectPoint(9, 10)).toBe(9);
});

test('too far', () => {
  const image = new Image(10, 10);
  const interpolate = getBorderInterpolation(BorderType.REFLECT, 0);
  const exp =
    /interpolateBorder only supports borders smaller than the original image/;
  expect(() => interpolate(-10, 0, 0, image)).toThrow(exp);
  expect(() => interpolate(19, 0, 0, image)).toThrow(exp);
  expect(() => interpolate(-110, 0, 0, image)).toThrow(exp);
  expect(() => interpolate(200, 0, 0, image)).toThrow(exp);
});

test('CONSTANT', () => {
  expect(interpolateConstantPoint(-4, 10)).toStrictEqual(-1);
  expect(interpolateConstantPoint(0, 10)).toBe(0);
  expect(interpolateConstantPoint(1, 10)).toBe(1);
  expect(interpolateConstantPoint(-200, 10)).toStrictEqual(-1);
  expect(interpolateConstantPoint(200, 10)).toStrictEqual(-1);
});

test('REPLICATE - negative', () => {
  expect(interpolateReplicatePoint(-1, 10)).toBe(0);
  expect(interpolateReplicatePoint(-2, 10)).toBe(0);
  expect(interpolateReplicatePoint(-8, 10)).toBe(0);
  expect(interpolateReplicatePoint(-9, 10)).toBe(0);
});

test('REPLICATE - positive', () => {
  expect(interpolateReplicatePoint(10, 10)).toBe(9);
  expect(interpolateReplicatePoint(11, 10)).toBe(9);
  expect(interpolateReplicatePoint(17, 10)).toBe(9);
  expect(interpolateReplicatePoint(18, 10)).toBe(9);
});

test('REFLECT - negative', () => {
  expect(interpolateReflectPoint(-1, 10)).toBe(0);
  expect(interpolateReflectPoint(-2, 10)).toBe(1);
  expect(interpolateReflectPoint(-8, 10)).toBe(7);
  expect(interpolateReflectPoint(-9, 10)).toBe(8);
});

test('REFLECT - positive', () => {
  expect(interpolateReflectPoint(10, 10)).toBe(9);
  expect(interpolateReflectPoint(11, 10)).toBe(8);
  expect(interpolateReflectPoint(17, 10)).toBe(2);
  expect(interpolateReflectPoint(18, 10)).toBe(1);
});

test('WRAP - negative', () => {
  expect(interpolateWrapPoint(-1, 10)).toBe(9);
  expect(interpolateWrapPoint(-2, 10)).toBe(8);
  expect(interpolateWrapPoint(-8, 10)).toBe(2);
  expect(interpolateWrapPoint(-9, 10)).toBe(1);
});

test('WRAP - positive', () => {
  expect(interpolateWrapPoint(10, 10)).toBe(0);
  expect(interpolateWrapPoint(11, 10)).toBe(1);
  expect(interpolateWrapPoint(17, 10)).toBe(7);
  expect(interpolateWrapPoint(18, 10)).toBe(8);
});

test('REFLECT_101 - negative', () => {
  expect(interpolateReflect101Point(-1, 10)).toBe(1);
  expect(interpolateReflect101Point(-2, 10)).toBe(2);
  expect(interpolateReflect101Point(-8, 10)).toBe(8);
  expect(interpolateReflect101Point(-9, 10)).toBe(9);
});

test('REFLECT_101 - positive', () => {
  expect(interpolateReflect101Point(10, 10)).toBe(8);
  expect(interpolateReflect101Point(11, 10)).toBe(7);
  expect(interpolateReflect101Point(17, 10)).toBe(1);
  expect(interpolateReflect101Point(18, 10)).toBe(0);
});
