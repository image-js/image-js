import { Image } from '../Image';
import { InterpolationType } from '../types';

import { BorderInterpolationFunction } from './interpolateBorder';
import { round } from './round';

type InterpolationFunction = (
  image: Image,
  x: number,
  y: number,
  channel: number,
  intepolateBorder: BorderInterpolationFunction
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

function interpolateNearest(
  image: Image,
  x: number,
  y: number,
  channel: number,
  interpolateBorder: BorderInterpolationFunction
): number {
  x = Math.round(x);
  y = Math.round(y);

  return interpolateBorder(x, y, channel, image);
}

function interpolateBilinear(
  image: Image,
  x: number,
  y: number,
  channel: number,
  interpolateBorder: BorderInterpolationFunction
): number {
  const px1 = Math.floor(x);
  const py1 = Math.floor(y);

  if (px1 === x && py1 === y) {
    return interpolateBorder(px1, py1, channel, image);
  }

  const px2 = px1 + 1;
  const py2 = py1 + 1;

  const vx1y1 = interpolateBorder(px1, py1, channel, image);
  const vx1y2 = interpolateBorder(px1, py2, channel, image);
  const vx2y1 = interpolateBorder(px2, py1, channel, image);
  const vx2y2 = interpolateBorder(px2, py2, channel, image);

  const r1 = (px2 - x) * vx1y1 + (x - px1) * vx2y1;
  const r2 = (px2 - x) * vx1y2 + (x - px1) * vx2y2;
  return round((py2 - y) * r1 + (y - py1) * r2);
}
