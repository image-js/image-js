import { Image } from '../Image';
import { getClamp } from '../utils/clamp';
import { getBorderInterpolation, BorderType } from '../utils/interpolateBorder';
import {
  getInterpolationFunction,
  InterpolationType,
} from '../utils/interpolatePixel';

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
   * Should the aspect ratio of the image be preserved?
   */
  preserveAspectRatio?: boolean;
  /**
   * Method to use to interpolate the new pixels
   *
   * @default InterpolationType.BILINEAR
   */
  interpolationType?: InterpolationType;
  /**
   * Specify how the borders should be handled.
   *
   * @default BorderType.CONSTANT
   */
  borderType?: BorderType;
  /**
   * Value of the border if BorderType is CONSTANT.
   *
   * @default 0
   */
  borderValue?: number;
}

/**
 * Returns a resized copy of an image.
 *
 * @param image - Original image.
 * @param options - Resize options.
 * @returns The new image.
 */
export function resize(image: Image, options: ResizeOptions): Image {
  const {
    interpolationType = InterpolationType.BILINEAR,
    borderType = BorderType.CONSTANT,
    borderValue = 0,
  } = options;
  const { width, height } = checkOptions(image, options);
  const newImage = Image.createFrom(image, { width, height });
  const interpolate = getInterpolationFunction(interpolationType);
  const interpolateBorder = getBorderInterpolation(borderType, borderValue);
  const clamp = getClamp(newImage);
  const intervalX = (image.width - 1) / (width - 1);
  const intervalY = (image.height - 1) / (height - 1);
  for (let row = 0; row < newImage.height; row++) {
    for (let column = 0; column < newImage.width; column++) {
      const nx = column * intervalX;
      const ny = row * intervalY;
      for (let channel = 0; channel < newImage.channels; channel++) {
        const newValue = interpolate(
          image,
          nx,
          ny,
          channel,
          interpolateBorder,
          clamp,
        );
        newImage.setValue(column, row, channel, newValue);
      }
    }
  }
  return newImage;
}

/**
 * Verify that the resize options are valid.
 *
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
    throw new Error(
      'At least one of the width, height, xFactor or yFactor options must be passed',
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
    xFactor: xFactor ?? newWidth / image.width,
    yFactor: yFactor ?? newHeight / image.height,
  };
}

/**
 * Compute automatic new size.
 *
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
    throw new Error('factor and size cannot be passed together');
  } else {
    return sizeOpt;
  }
  return undefined;
}
