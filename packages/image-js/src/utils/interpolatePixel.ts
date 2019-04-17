import { Image } from '../Image';
import { InterpolationType } from '../types';

import { BorderInterpolationFunction } from './interpolateBorder';
import { round } from './round';
import { ClampFunction } from './clamp';

type InterpolationFunction = (
  image: Image,
  x: number,
  y: number,
  channel: number,
  intepolateBorder: BorderInterpolationFunction,
  clamp: ClampFunction
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
    case InterpolationType.BICUBIC: {
      return interpolateBicubic;
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
  const px0 = Math.floor(x);
  const py0 = Math.floor(y);

  if (px0 === x && py0 === y) {
    return interpolateBorder(px0, py0, channel, image);
  }

  const px1 = px0 + 1;
  const py1 = py0 + 1;

  const vx0y0 = interpolateBorder(px0, py0, channel, image);
  const vx1y0 = interpolateBorder(px1, py0, channel, image);
  const vx0y1 = interpolateBorder(px0, py1, channel, image);
  const vx1y1 = interpolateBorder(px1, py1, channel, image);

  const r1 = (px1 - x) * vx0y0 + (x - px0) * vx1y0;
  const r2 = (px1 - x) * vx0y1 + (x - px0) * vx1y1;
  return round((py1 - y) * r1 + (y - py0) * r2);
}

function interpolateBicubic(
  image: Image,
  x: number,
  y: number,
  channel: number,
  interpolateBorder: BorderInterpolationFunction,
  clamp: ClampFunction
): number {
  const px1 = Math.floor(x);
  const py1 = Math.floor(y);

  if (px1 === x && py1 === y) {
    return interpolateBorder(px1, py1, channel, image);
  }

  const xNorm = x - px1;
  const yNorm = y - py1;

  const vx0y0 = interpolateBorder(px1 - 1, py1 - 1, channel, image);
  const vx1y0 = interpolateBorder(px1, py1 - 1, channel, image);
  const vx2y0 = interpolateBorder(px1 + 1, py1 - 1, channel, image);
  const vx3y0 = interpolateBorder(px1 + 2, py1 - 1, channel, image);
  const v0 = cubic(vx0y0, vx1y0, vx2y0, vx3y0, xNorm);

  const vx0y1 = interpolateBorder(px1 - 1, py1, channel, image);
  const vx1y1 = interpolateBorder(px1, py1, channel, image);
  const vx2y1 = interpolateBorder(px1 + 1, py1, channel, image);
  const vx3y1 = interpolateBorder(px1 + 2, py1, channel, image);
  const v1 = cubic(vx0y1, vx1y1, vx2y1, vx3y1, xNorm);

  const vx0y2 = interpolateBorder(px1 - 1, py1 + 1, channel, image);
  const vx1y2 = interpolateBorder(px1, py1 + 1, channel, image);
  const vx2y2 = interpolateBorder(px1 + 1, py1 + 1, channel, image);
  const vx3y2 = interpolateBorder(px1 + 2, py1 + 1, channel, image);
  const v2 = cubic(vx0y2, vx1y2, vx2y2, vx3y2, xNorm);

  const vx0y3 = interpolateBorder(px1 - 1, py1 + 2, channel, image);
  const vx1y3 = interpolateBorder(px1, py1 + 2, channel, image);
  const vx2y3 = interpolateBorder(px1 + 1, py1 + 2, channel, image);
  const vx3y3 = interpolateBorder(px1 + 2, py1 + 2, channel, image);
  const v3 = cubic(vx0y3, vx1y3, vx2y3, vx3y3, xNorm);

  return round(clamp(cubic(v0, v1, v2, v3, yNorm)));
}

function cubic(a: number, b: number, c: number, d: number, x: number): number {
  return (
    b +
    0.5 *
      x *
      (c -
        a +
        x * (2.0 * a - 5.0 * b + 4.0 * c - d + x * (3.0 * (b - c) + d - a)))
  );
}
