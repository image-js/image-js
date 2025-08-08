import { line } from 'bresenham-zingl';

import type { Image } from '../Image.js';
import type { Point } from '../utils/geometry/points.js';
import { getDefaultColor } from '../utils/getDefaultColor.js';
import { getOutputImage } from '../utils/getOutputImage.js';
import { setBlendedVisiblePixel } from '../utils/setBlendedVisiblePixel.js';
import checkProcessable from '../utils/validators/checkProcessable.js';
import { validateColor } from '../utils/validators/validators.js';

export interface DrawLineOnImageOptions {
  /**
   * Color of the line - An array of numerical values, one for each channel of the image. If less values are defined than there are channels in the image, the remaining channels will be set to 0.
   * @default A black pixel.
   */
  strokeColor?: number[];
  /**
   * Origin of the line relative to a parent image (top-left corner).
   * @default `{row: 0, column: 0}`
   */
  origin?: Point;
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Image;
}

/**
 * Draw a line defined by two points onto an image.
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
    strokeColor = getDefaultColor(newImage),
    origin = { column: 0, row: 0 },
  } = options;

  validateColor(strokeColor, newImage);

  checkProcessable(newImage, {
    bitDepth: [8, 16],
  });

  line(
    Math.round(origin.column + from.column),
    Math.round(origin.row + from.row),
    Math.round(origin.column + to.column),
    Math.round(origin.row + to.row),
    (column: number, row: number) => {
      setBlendedVisiblePixel(newImage, column, row, strokeColor);
    },
  );
  return newImage;
}
