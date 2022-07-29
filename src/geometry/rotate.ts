import { Image, ImageCoordinates } from '../Image';
import { BorderType } from '../utils/interpolateBorder';
import { InterpolationType } from '../utils/interpolatePixel';

import { transform } from './transform';

export interface RotateOptions {
  /**
   * Specify the rotation center point
   *
   * @default The center of the image.
   */
  center?: ImageCoordinates | [number, number];
  /**
   * Scaling factor for the rotated image.
   *
   * @default 1
   */
  scale?: number;
  /**
   * Width of the final image.
   */
  width?: number;
  /**
   * Height of the final image.
   */
  height?: number;
  /*
    Bypasses width, height, and center options to include
    every pixel of the original image inside the rotated image
  */
  fullImage?: boolean;
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
 * Rotate an image anti-clockwise of a given angle.
 *
 * @param image - Original image.
 * @param angle - Angle in degrees.
 * @param options - Rotate options.
 * @returns A new rotated image.
 */
export function rotate(
  image: Image,
  angle: number,
  options: RotateOptions = {},
): Image {
  const { center = ImageCoordinates.CENTER, scale = 1 } = options;

  let centerCoordinates;
  if (typeof center === 'string') {
    centerCoordinates = image.getCoordinates(center);
  } else {
    centerCoordinates = center;
  }
  const transformMatrix = getRotationMatrix(angle, centerCoordinates, scale);

  return transform(image, transformMatrix, options);
}

/**
 * Generates a rotation matrix for the given angle.
 *
 * @param angle - Angle in degrees.
 * @param center - Center point of the image.
 * @param scale - Scaling factor.
 * @returns 2 x 3 rotation matrix.
 */
function getRotationMatrix(
  angle: number,
  center: [number, number],
  scale: number,
): number[][] {
  const angleRadians = (angle * Math.PI) / 180;
  const cos = scale * Math.cos(angleRadians);
  const sin = scale * Math.sin(angleRadians);
  return [
    [cos, sin, (1 - cos) * center[0] - sin * center[1]],
    [-sin, cos, sin * center[0] + (1 - cos) * center[1]],
  ];
}
