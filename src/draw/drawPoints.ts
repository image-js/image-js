import { IJS } from '../IJS';
import { Mask } from '../Mask';
import checkProcessable from '../utils/checkProcessable';
import { Point } from '../utils/geometry/points';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage, maskToOutputMask } from '../utils/getOutputImage';

export interface DrawPointsOptions {
  /**
   * Color of the points. Should be an array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default 'black'
   */
  color?: number[];
  /**
   * Image to which the resulting image has to be put.
   */
  out?: IJS;
}

export function drawPoints(
  image: IJS,
  points: Point[],
  options?: DrawPointsOptions,
): IJS;
export function drawPoints(
  image: Mask,
  points: Point[],
  options?: DrawPointsOptions,
): Mask;

/**
 * Draw a set of points on an image or a mask.
 *
 * @param image - The image on which to draw the points.
 * @param points - Array of points.
 * @param options - Draw points on IJS options.
 * @returns New mask.
 */
export function drawPoints(
  image: IJS | Mask,
  points: Point[],
  options: DrawPointsOptions = {},
): IJS | Mask {
  let newImage;
  if (image instanceof IJS) {
    newImage = getOutputImage(image, options, { clone: true });
  } else {
    newImage = maskToOutputMask(image, options, { clone: true });
  }
  const { color = getDefaultColor(newImage) } = options;

  checkProcessable(newImage, 'drawPoints', {
    bitDepth: [1, 8, 16],
  });

  for (const point of points) {
    newImage.setPixel(point.column, point.row, color);
  }

  return newImage;
}
