import { Image } from '../Image';
import { BorderType, InterpolationType } from '../types';

import { interpolateBorder } from './interpolateBorder';
import { round } from './round';

type InterpolationFunction = (
  image: Image,
  x: number,
  y: number,
  channel: number,
  borderType: BorderType,
  borderValue: number
) => number;

export function getInterpolationFunction(
  interpolationType: InterpolationType
): InterpolationFunction {
  switch (interpolationType) {
    case InterpolationType.NEAREST: {
      return interpolateNearest;
    }
    case InterpolationType.BILINEAR: {
      return interpolateBilinear;
    }
    default: {
      throw new Error(`interpolation ${interpolationType} not implemented`);
    }
  }
}

export function interpolateNearest(
  image: Image,
  x: number,
  y: number,
  channel: number,
  borderType: BorderType,
  borderValue: number
): number {
  x = Math.round(x);
  y = Math.round(y);

  const px = interpolateBorder(x, image.width, borderType);
  const py = interpolateBorder(y, image.height, borderType);
  if (px < 0 || py < 0) {
    return borderValue;
  }
  return image.getValue(py, px, channel);
}

export function interpolateBilinear(
  image: Image,
  x: number,
  y: number,
  channel: number,
  borderType: BorderType,
  borderValue: number
): number {
  const px1 = Math.floor(x);
  const py1 = Math.floor(y);

  if (px1 === x && py1 === y) {
    return image.getValue(
      interpolateBorder(px1, image.width, borderType),
      interpolateBorder(py1, image.height, borderType),
      channel
    );
  }

  const px2 = px1 + 1;
  const py2 = py1 + 1;

  const ix1 = interpolateBorder(px1, image.width, borderType);
  const ix2 = interpolateBorder(px2, image.width, borderType);
  const iy1 = interpolateBorder(py1, image.height, borderType);
  const iy2 = interpolateBorder(py2, image.height, borderType);
  if (ix1 < 0 || ix2 < 0 || iy1 < 0 || iy2 < 0) {
    return borderValue;
  }

  const vx1y1 = image.getValue(iy1, ix1, channel);
  const vx1y2 = image.getValue(iy2, ix1, channel);
  const vx2y1 = image.getValue(iy1, ix2, channel);
  const vx2y2 = image.getValue(iy2, ix2, channel);

  const r1 = (px2 - x) * vx1y1 + (x - px1) * vx2y1;
  const r2 = (px2 - x) * vx1y2 + (x - px1) * vx2y2;
  return round((py2 - y) * r1 + (y - py1) * r2);
}
