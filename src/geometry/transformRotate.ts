import { Image, ImageCoordinates } from '../Image';
import { Point } from '../utils/geometry/points';

import { transform, TransformOptions } from './transform';

export interface TransformRotateOptions extends TransformOptions {
  /**
   * Specify the rotation center point as a predefined string or a Point.
   * @default The center of the image.
   */
  center?: ImageCoordinates | Point;
  /**
   * Scaling factor for the rotated image.
   * @default 1
   */
  scale?: number;
}

/**
 * Rotate an image anti-clockwise of a given angle.
 * @param image - Original image.
 * @param angle - Angle in degrees.
 * @param options - Rotate options.
 * @returns A new rotated image.
 */
export function transformRotate(
  image: Image,
  angle: number,
  options: TransformRotateOptions = {},
): Image {
  const { center = 'center', scale = 1, ...otherOptions } = options;

  let centerCoordinates;
  if (typeof center === 'string') {
    centerCoordinates = image.getCoordinates(center);
  } else {
    centerCoordinates = center;
  }
  const transformMatrix = getRotationMatrix(angle, centerCoordinates, scale);

  return transform(image, transformMatrix, otherOptions);
}

/**
 * Generates a rotation matrix for the given angle.
 * @param angle - Angle in degrees.
 * @param center - Center point of the image.
 * @param scale - Scaling factor.
 * @returns 2 x 3 rotation matrix.
 */
function getRotationMatrix(
  angle: number,
  center: Point,
  scale: number,
): number[][] {
  const angleRadians = (angle * Math.PI) / 180;
  const cos = scale * Math.cos(angleRadians);
  const sin = scale * Math.sin(angleRadians);
  return [
    [cos, sin, (1 - cos) * center.column - sin * center.row],
    [-sin, cos, sin * center.column + (1 - cos) * center.row],
  ];
}
