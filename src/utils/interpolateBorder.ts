import { IJS } from '../IJS';

export enum BorderType {
  CONSTANT = 'CONSTANT',
  REPLICATE = 'REPLICATE',
  REFLECT = 'REFLECT',
  WRAP = 'WRAP',
  REFLECT_101 = 'REFLECT_101',
}

export type BorderInterpolationFunction = (
  column: number,
  row: number,
  channel: number,
  image: IJS,
) => number;

/**
 * Pick the border interpolation algorithm.
 * The different algorithms are illustrated here:
 * https://vovkos.github.io/doxyrest-showcase/opencv/sphinx_rtd_theme/enum_cv_BorderTypes.html
 *
 * @param type
 * @param value
 */
export function getBorderInterpolation(
  type: BorderType,
  value: number,
): BorderInterpolationFunction {
  switch (type) {
    case BorderType.CONSTANT:
      return getInterpolateConstant(value);
    case BorderType.REPLICATE:
      return interpolateReplicate;
    case BorderType.REFLECT:
      return interpolateReflect;
    case BorderType.REFLECT_101:
      return interpolateReflect101;
    case BorderType.WRAP:
      return interpolateWrap;
    default:
      throw new Error(
        `interpolateBorder cannot be used with border type ${type}`,
      );
  }
}

function checkRange(point: number, length: number): void {
  if (point <= 0 - length || point >= length + length - 1) {
    throw new RangeError(
      'interpolateBorder only supports borders smaller than the original image',
    );
  }
}

function getInterpolateConstant(value: number): BorderInterpolationFunction {
  return function interpolateConstant(
    column: number,
    row: number,
    channel: number,
    image: IJS,
  ): number {
    const newX = interpolateConstantPoint(column, image.width);
    const newY = interpolateConstantPoint(row, image.height);
    if (newX === -1 || newY === -1) {
      return value;
    }
    return image.getValue(newY, newX, channel);
  };
}

/**
 * @param point
 * @param length
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
  image: IJS,
): number {
  return image.getValue(
    interpolateReplicatePoint(row, image.height),
    interpolateReplicatePoint(column, image.width),
    channel,
  );
}

/**
 * @param point
 * @param length
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
  image: IJS,
): number {
  return image.getValue(
    interpolateReflectPoint(row, image.height),
    interpolateReflectPoint(column, image.width),
    channel,
  );
}

/**
 * @param point
 * @param length
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
  image: IJS,
): number {
  return image.getValue(
    interpolateWrapPoint(row, image.height),
    interpolateWrapPoint(column, image.width),
    channel,
  );
}

/**
 * @param point
 * @param length
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
  image: IJS,
): number {
  return image.getValue(
    interpolateReflect101Point(row, image.height),
    interpolateReflect101Point(column, image.width),
    channel,
  );
}

/**
 * @param point
 * @param length
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
