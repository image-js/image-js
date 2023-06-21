import { Image } from '../Image';
import { Mask } from '../Mask';
import checkProcessable from '../utils/checkProcessable';
import { Point } from '../utils/geometry/points';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage, maskToOutputMask } from '../utils/getOutputImage';
import { validateColor } from '../utils/validators';

export interface DrawPointsOptions {
  /**
   * Color of the points. Should be an array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   * @default 'black'
   */
  color?: number[];
  /**
   * Origin of the points relative to a parent image (top-left corner).
   * @default {row: 0, column: 0}
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
    newImage.setVisiblePixel(
      Math.round(origin.column + point.column),
      Math.round(origin.row + point.row),
      color,
    );
  }

  return newImage;
}
