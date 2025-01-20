import type { Image } from '../Image.js';
import type { BorderType } from '../utils/interpolateBorder.js';
import type { InterpolationType } from '../utils/interpolatePixel.js';
import { assert } from '../utils/validators/assert.js';

import { transform } from './transform.js';

export interface ResizeOptions {
  /**
   * Width of the output image.
   */
  width?: number;
  /**
   * Height of the output image.
   */
  height?: number;
  /**
   * Factor by which to scale the width.
   */
  xFactor?: number;
  /**
   * Factor by which to scale the width.
   */
  yFactor?: number;
  /**
   * Whether the aspect ratio of the image should be preserved.
   * @default `true`
   */
  preserveAspectRatio?: boolean;
  /**
   * Method to use to interpolate the new pixels.
   * @default `'bilinear'`
   */
  interpolationType?: InterpolationType;
  /**
   * Specify how the borders should be handled.
   * @default `'constant'`
   */
  borderType?: BorderType;
  /**
   * Value of the border if BorderType is 'constant'.
   * @default `0`
   */
  borderValue?: number;
}

/**
 * Returns a resized copy of an image.
 * @param image - Original image.
 * @param options - Resize options.
 * @returns The new image.
 */
export function resize(image: Image, options: ResizeOptions): Image {
  const {
    interpolationType = 'bilinear',
    borderType = 'replicate',
    borderValue = 0,
  } = options;
  const { width, height, xFactor, yFactor } = checkOptions(image, options);

  return transform(
    image,
    [
      [xFactor, 0, xFactor / 2],
      [0, yFactor, yFactor / 2],
    ],
    {
      interpolationType,
      borderType,
      borderValue,
      height,
      width,
    },
  );
}

/**
 * Verify that the resize options are valid.
 * @param image - Image.
 * @param options - Resize options.
 * @returns Resize options.
 */
function checkOptions(
  image: Image,
  options: ResizeOptions,
): { width: number; height: number; xFactor: number; yFactor: number } {
  const {
    width,
    height,
    xFactor,
    yFactor,
    preserveAspectRatio = true,
  } = options;

  if (
    width === undefined &&
    height === undefined &&
    xFactor === undefined &&
    yFactor === undefined
  ) {
    throw new TypeError(
      'at least one of the width, height, xFactor or yFactor options must be passed',
    );
  }

  let newWidth: number;
  let newHeight: number;

  const maybeWidth = getSize(width, xFactor, image.width, preserveAspectRatio);

  const maybeHeight = getSize(
    height,
    yFactor,
    image.height,
    preserveAspectRatio,
  );

  if (maybeWidth === undefined) {
    assert(maybeHeight !== undefined);
    newWidth = Math.round(maybeHeight * (image.width / image.height));
  } else {
    newWidth = maybeWidth;
  }

  if (maybeHeight === undefined) {
    assert(maybeWidth !== undefined);
    newHeight = Math.round(maybeWidth * (image.height / image.width));
  } else {
    newHeight = maybeHeight;
  }

  return {
    width: newWidth,
    height: newHeight,
    xFactor: xFactor ?? newWidth / image.width,
    yFactor: yFactor ?? newHeight / image.height,
  };
}

/**
 * Compute automatic new size.
 * @param sizeOpt - Size option.
 * @param factor - Factor option.
 * @param sizeImg - Size of the image.
 * @param preserveAspectRatio - Whether to preserve the aspect ratio.
 * @returns New size.
 */
function getSize(
  sizeOpt: number | undefined,
  factor: number | undefined,
  sizeImg: number,
  preserveAspectRatio: boolean,
): number | undefined {
  if (sizeOpt === undefined) {
    if (factor !== undefined) {
      return Math.round(sizeImg * factor);
    } else if (!preserveAspectRatio) {
      return sizeImg;
    }
  } else if (factor !== undefined) {
    throw new TypeError('factor and size cannot be passed together');
  } else {
    return sizeOpt;
  }
  return undefined;
}
