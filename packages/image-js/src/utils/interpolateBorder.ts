import { BorderType } from '../types';
import { Image } from '../Image';

export type BorderInterpolationFunction = (
  x: number,
  y: number,
  channel: number,
  image: Image
) => number;

export function getBorderInterpolation(
  type: BorderType,
  value: number
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
        `interpolateBorder cannot be used with border type ${type}`
      );
  }
}

function checkRange(point: number, length: number): void {
  if (point <= 0 - length || point >= length + length - 1) {
    throw new RangeError(
      'interpolateBorder only supports borders smaller than the original image'
    );
  }
}

function getInterpolateConstant(value: number): BorderInterpolationFunction {
  return function interpolateConstant(
    x: number,
    y: number,
    channel: number,
    image: Image
  ): number {
    const newX = interpolateConstantPoint(x, image.width);
    const newY = interpolateConstantPoint(y, image.height);
    if (newX === -1 || newY === -1) {
      return value;
    }
    return image.getValue(newY, newX, channel);
  };
}

export function interpolateConstantPoint(
  point: number,
  length: number
): number {
  if (point >= 0 && point < length) {
    return point;
  }
  return -1;
}

function interpolateReplicate(
  x: number,
  y: number,
  channel: number,
  image: Image
): number {
  return image.getValue(
    interpolateReplicatePoint(y, image.height),
    interpolateReplicatePoint(x, image.width),
    channel
  );
}

export function interpolateReplicatePoint(
  point: number,
  length: number
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
  x: number,
  y: number,
  channel: number,
  image: Image
): number {
  return image.getValue(
    interpolateReflectPoint(y, image.height),
    interpolateReflectPoint(x, image.width),
    channel
  );
}

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
  x: number,
  y: number,
  channel: number,
  image: Image
): number {
  return image.getValue(
    interpolateWrapPoint(y, image.height),
    interpolateWrapPoint(x, image.width),
    channel
  );
}

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
  x: number,
  y: number,
  channel: number,
  image: Image
): number {
  return image.getValue(
    interpolateReflect101Point(y, image.height),
    interpolateReflect101Point(x, image.width),
    channel
  );
}

export function interpolateReflect101Point(
  point: number,
  length: number
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
