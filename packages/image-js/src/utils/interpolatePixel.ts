import { Image } from '../Image';
import { BorderType, InterpolationType } from '../types';

import { interpolateBorder } from './interpolateBorder';

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
