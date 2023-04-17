import { line } from 'bresenham-zingl';

import { Image } from '../Image';
import checkProcessable from '../utils/checkProcessable';
import { Point } from '../utils/geometry/points';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';
import { validateColor } from '../utils/validators';

export interface DrawLineOnImageOptions {
  /**
   * Color of the line. Should be an array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default 'black'
   */
  strokeColor?: number[];
  /**
   * Origin of the line relative to a parent image (top-left corner).
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
 * Draw a line defined by two points onto an image.
 *
 * @param image - Image to process.
 * @param from - Line starting point.
 * @param to - Line ending point.
 * @param options - Draw Line options.
 * @returns The mask with the line drawing.
 */
export function drawLineOnImage(
  image: Image,
  from: Point,
  to: Point,
  options: DrawLineOnImageOptions = {},
): Image {
  const newImage = getOutputImage(image, options, { clone: true });
  const {
    strokeColor: color = getDefaultColor(newImage),
    origin = { column: 0, row: 0 },
  } = options;

  validateColor(color, newImage);

  checkProcessable(newImage, {
    bitDepth: [8, 16],
  });

  line(
    Math.round(origin.column + from.column),
    Math.round(origin.row + from.row),
    Math.round(origin.column + to.column),
    Math.round(origin.row + to.row),
    (column: number, row: number) => {
      newImage.setVisiblePixel(column, row, color);
    },
  );
  return newImage;
}
