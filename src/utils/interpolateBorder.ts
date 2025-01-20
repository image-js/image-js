import { match } from 'ts-pattern';

import type { Image } from '../Image.js';

import type { BorderInterpolationFunction } from './utils.types.js';

export const BorderType = {
  CONSTANT: 'constant',
  REPLICATE: 'replicate',
  REFLECT: 'reflect',
  WRAP: 'wrap',
  REFLECT_101: 'reflect101',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BorderType = (typeof BorderType)[keyof typeof BorderType];

/**
 * Pick the border interpolation algorithm.
 * The different algorithms are illustrated here:
 * @see {@link https://vovkos.github.io/doxyrest-showcase/opencv/sphinx_rtd_theme/enum_cv_BorderTypes.html}
 * @param type - The border type.
 * @param value - A pixel value if BorderType.CONSTANT is used.
 * @returns The border interpolation function.
 */
export function getBorderInterpolation(
  type: BorderType,
  value: number,
): BorderInterpolationFunction {
  return match(type)
    .with('constant', () => getInterpolateConstant(value))
    .with('replicate', () => interpolateReplicate)
    .with('reflect', () => interpolateReflect)
    .with('reflect101', () => interpolateReflect101)
    .with('wrap', () => interpolateWrap)
    .exhaustive();
}

function checkRange(point: number, length: number): void {
  if (point <= 0 - length || point >= length + length - 1) {
    throw new RangeError('border must be smaller than the original image');
  }
}

function getInterpolateConstant(value: number): BorderInterpolationFunction {
  return function interpolateConstant(
    column: number,
    row: number,
    channel: number,
    image: Image,
  ): number {
    const newColumn = interpolateConstantPoint(column, image.width);
    const newRow = interpolateConstantPoint(row, image.height);
    if (newColumn === -1 || newRow === -1) {
      return value;
    }
    return image.getValue(newColumn, newRow, channel);
  };
}

/**
 * Interpolate using a constant point.
 * @param point - The point to interpolate.
 * @param length  - The length of the image.
 * @returns The interpolated point.
 */
export function interpolateConstantPoint(
  point: number,
  length: number,
): number {
  if (point >= 0 && point < length) {
    return point;
  }
  return -1;
}

function interpolateReplicate(
  column: number,
  row: number,
  channel: number,
  image: Image,
): number {
  return image.getValue(
    interpolateReplicatePoint(column, image.width),
    interpolateReplicatePoint(row, image.height),
    channel,
  );
}

/**
 * Interpolate by replicating the border.
 * @param point - The point to interpolate.
 * @param length - The length of the image.
 * @returns The interpolated point.
 */
export function interpolateReplicatePoint(
  point: number,
  length: number,
): number {
  if (point >= 0 && point < length) {
    return point;
  }
  checkRange(point, length);
  if (point < 0) {
    return 0;
  } else {
    return length - 1;
  }
}

function interpolateReflect(
  column: number,
  row: number,
  channel: number,
  image: Image,
): number {
  return image.getValue(
    interpolateReflectPoint(column, image.width),
    interpolateReflectPoint(row, image.height),
    channel,
  );
}

/**
 * Interpolate by reflecting the border.
 * @param point - The point to interpolate.
 * @param length - The length of the image.
 * @returns The interpolated point.
 */
export function interpolateReflectPoint(point: number, length: number): number {
  if (point >= 0 && point < length) {
    return point;
  }
  checkRange(point, length);
  if (point < 0) {
    return -1 - point;
  } else {
    return length + length - 1 - point;
  }
}

function interpolateWrap(
  column: number,
  row: number,
  channel: number,
  image: Image,
): number {
  return image.getValue(
    interpolateWrapPoint(column, image.width),
    interpolateWrapPoint(row, image.height),
    channel,
  );
}

/**
 * Interpolate by wrapping the border.
 * @param point - The point to interpolate.
 * @param length - The length of the image.
 * @returns The interpolated point.
 */
export function interpolateWrapPoint(point: number, length: number): number {
  if (point >= 0 && point < length) {
    return point;
  }
  checkRange(point, length);
  if (point < 0) {
    return length + point;
  } else {
    return point - length;
  }
}

function interpolateReflect101(
  column: number,
  row: number,
  channel: number,
  image: Image,
): number {
  return image.getValue(
    interpolateReflect101Point(column, image.width),
    interpolateReflect101Point(row, image.height),
    channel,
  );
}

/**
 * Interpolate by reflecting the border.
 * @param point - The point to interpolate.
 * @param length - The length of the image.
 * @returns The interpolated point.
 */
export function interpolateReflect101Point(
  point: number,
  length: number,
): number {
  if (point >= 0 && point < length) {
    return point;
  }
  checkRange(point, length);
  if (point < 0) {
    return 0 - point;
  } else {
    return length + length - 2 - point;
  }
}
