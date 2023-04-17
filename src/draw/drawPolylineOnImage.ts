import { Image } from '../Image';
import checkProcessable from '../utils/checkProcessable';
import { Point } from '../utils/geometry/points';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';
import { validateColor } from '../utils/validators';

export interface DrawPolylineOnImageOptions {
  /**
   * Line color - array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default black
   */
  strokeColor?: number[];
  /**
   * Origin of the rectangle relative to a parent image (top-left corner).
   *
   * @default {row: 0, column: 0}
   */
  origin?: Point;
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Image;
}

/**
 * Draw a polyline defined by an array of points on an image.
 *
 * @param image - Image to process.
 * @param points - Polyline array of points.
 * @param options - Draw polyline options.
 * @returns The image with the polyline drawing.
 */
export function drawPolylineOnImage(
  image: Image,
  points: Point[],
  options: DrawPolylineOnImageOptions = {},
): Image {
  const {
    strokeColor: color = getDefaultColor(image),
    origin = { column: 0, row: 0 },
  } = options;

  checkProcessable(image, {
    bitDepth: [8, 16],
  });
  let newImage = getOutputImage(image, options, { clone: true });

  validateColor(color, newImage);

  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];

    newImage.drawLine(from, to, { out: newImage, strokeColor: color, origin });
  }
  return newImage;
}
