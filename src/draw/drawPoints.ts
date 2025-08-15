import { Image } from '../Image.js';
import type { Mask } from '../Mask.js';
import type { Point } from '../utils/geometry/points.js';
import { getDefaultColor } from '../utils/getDefaultColor.js';
import { getOutputImage, maskToOutputMask } from '../utils/getOutputImage.js';
import { setBlendedVisiblePixel } from '../utils/setBlendedVisiblePixel.js';
import checkProcessable from '../utils/validators/checkProcessable.js';
import { validateColor } from '../utils/validators/validators.js';

export interface DrawPointsOptions {
  /**
   * Color of the points - An array of numerical values, one for each channel of the image. If less values are defined than there are channels in the image, the remaining channels will be set to 0.
   * @default A black pixel.
   */
  color?: number[];
  /**
   * Origin of the points relative to a parent image (top-left corner).
   * @default `{row: 0, column: 0}`
   */
  origin?: Point;
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Image | Mask;
}

export function drawPoints(
  image: Image,
  points: Point[],
  options?: DrawPointsOptions,
): Image;
export function drawPoints(
  image: Mask,
  points: Point[],
  options?: DrawPointsOptions,
): Mask;

/**
 * Draw a set of points on an image or a mask.
 * @param image - The image on which to draw the points.
 * @param points - Array of points.
 * @param options - Draw points on Image options.
 * @returns New mask.
 */
export function drawPoints(
  image: Image | Mask,
  points: Point[],
  options: DrawPointsOptions = {},
): Image | Mask {
  const { color = getDefaultColor(image), origin = { row: 0, column: 0 } } =
    options;
  let newImage;
  if (image instanceof Image) {
    newImage = getOutputImage(image, options, { clone: true });
    validateColor(color, newImage);
  } else {
    newImage = maskToOutputMask(image, options, { clone: true });
  }

  checkProcessable(newImage, {
    bitDepth: [1, 8, 16],
  });

  for (const point of points) {
    setBlendedVisiblePixel(
      newImage,
      Math.round(origin.column + point.column),
      Math.round(origin.row + point.row),
      color,
    );
  }

  return newImage;
}
