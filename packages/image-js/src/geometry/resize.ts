import { Image } from '../Image';
import { InterpolationType } from '../types';

import { transform } from './transform';

export interface IResizeOptions {
  width?: number;
  height?: number;
  xFactor?: number;
  yFactor?: number;
  preserveAspectRatio?: boolean;
  interpolation?: InterpolationType;
}

export function resize(image: Image, options: IResizeOptions): Image {
  const { width, height, xFactor, yFactor } = checkOptions(image, options);
  const transformation = [[xFactor, 0, 0], [0, yFactor, 0]];
  return transform(image, transformation, {
    width,
    height,
    interpolationType: options.interpolation
  });
}

function checkOptions(
  image: Image,
  options: IResizeOptions
): { width: number; height: number; xFactor: number; yFactor: number } {
  const {
    width,
    height,
    xFactor,
    yFactor,
    preserveAspectRatio = true
  } = options;

  if (
    width === undefined &&
    height === undefined &&
    xFactor === undefined &&
    yFactor === undefined
  ) {
    throw new Error(
      'At least one of the width, height, xFactor or yFactor options must be passed'
    );
  }

  let newWidth: number;
  let newHeight: number;

  const maybeWidth = getSize(width, xFactor, image.width, preserveAspectRatio);
  const maybeHeight = getSize(
    height,
    yFactor,
    image.height,
    preserveAspectRatio
  );

  if (maybeWidth === undefined) {
    if (maybeHeight !== undefined) {
      newWidth = Math.round(maybeHeight * (image.width / image.height));
    } else {
      throw new Error('UNREACHABLE');
    }
  } else {
    newWidth = maybeWidth;
  }

  if (maybeHeight === undefined) {
    if (maybeWidth !== undefined) {
      newHeight = Math.round(maybeWidth * (image.height / image.width));
    } else {
      throw new Error('UNREACHABLE');
    }
  } else {
    newHeight = maybeHeight;
  }

  return {
    width: newWidth,
    height: newHeight,
    xFactor: xFactor ? xFactor : newWidth / image.width,
    yFactor: yFactor ? yFactor : newHeight / image.height
  };
}

function getSize(
  sizeOpt: number | undefined,
  factor: number | undefined,
  sizeImg: number,
  preserveAspectRatio: boolean
): number | undefined {
  if (sizeOpt === undefined) {
    if (factor !== undefined) {
      return Math.round(sizeImg * factor);
    } else if (!preserveAspectRatio) {
      return sizeImg;
    }
  } else if (factor !== undefined) {
    throw new Error('factor must not be passed with size');
  } else {
    return sizeOpt;
  }
  return undefined;
}
