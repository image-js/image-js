import { circle } from 'bresenham-zingl';

import type { Image } from '../Image.js';
import type { Point } from '../utils/geometry/points.js';
import { getDefaultColor } from '../utils/getDefaultColor.js';
import { getOutputImage } from '../utils/getOutputImage.js';
import { setBlendedVisiblePixel } from '../utils/setBlendedVisiblePixel.js';
import checkProcessable from '../utils/validators/checkProcessable.js';
import { validateColor } from '../utils/validators/validators.js';

import { roundPoint } from './utils/roundPoint.js';

// Inspired by https://www.geeksforgeeks.org/bresenhams-circle-drawing-algorithm/

export interface DrawCircleOnImageOptions {
  /**
   * Circle border color - An array of numerical values, one for each channel of the image. If less values are defined than there are channels in the image, the remaining channels will be set to 0.
   * @default A black pixel.
   */
  strokeColor?: number[];
  /**
   * Circle fill color - An array of numerical values, one for each channel of the image. If less values are defined than there are channels in the image, the remaining channels will be set to 0.
   *
   */
  fillColor?: number[];

  /**
   * Image to which the resulting image has to be put.
   */
  out?: Image;
}

/**
 * Draw a circle defined by center and radius.
 * @param image - Image to process.
 * @param center - Circle center point.
 * @param radius - Circle radius.
 * @param options - Draw circle options.
 * @returns The original drawn image.
 */
export function drawCircleOnImage(
  image: Image,
  center: Point,
  radius: number,
  options: DrawCircleOnImageOptions = {},
): Image {
  const newImage = getOutputImage(image, options, { clone: true });
  const { strokeColor = getDefaultColor(newImage), fillColor } = options;

  validateColor(strokeColor, newImage);

  checkProcessable(newImage, {
    bitDepth: [8, 16],
  });

  if (radius < 0) {
    throw new RangeError('circle radius must be positive');
  }

  center = roundPoint(center);
  radius = Math.round(radius);

  if (radius === 0) {
    setBlendedVisiblePixel(newImage, center.column, center.row, strokeColor);
    return newImage;
  }

  if (!fillColor) {
    circle(center.column, center.row, radius, (column: number, row: number) => {
      setBlendedVisiblePixel(newImage, column, row, strokeColor);
    });
  } else {
    if (radius === 1) {
      setBlendedVisiblePixel(newImage, center.column, center.row, fillColor);
    }
    //Starting points for the top and bottom row of the circle.
    let prevRow = center.row + radius;

    let index = 0;
    circle(center.column, center.row, radius, (column: number, row: number) => {
      setBlendedVisiblePixel(newImage, column, row, strokeColor);
      // Filling the first line of the circle.
      if (index === 0) {
        newImage.drawLine(
          { row, column: column - 1 },
          {
            row,
            column: center.column - (column - center.column - 1),
          },
          { strokeColor: fillColor, out: newImage },
        );
      }
      // The algorithm used is Bresenham's circle algorithm (@link https://www.geeksforgeeks.org/bresenhams-circle-drawing-algorithm/) to find points that constitute the circle outline. However, in this algorithm The circle is divided in 4 parts instead of 8: top, right, bottom and left.
      // The algorithm draws a point per quadrant until the circle is complete.
      // We use bottom (index % 4 === 1, quadrant 2) point of the outline to fill the circle with color.
      // Filling half of the circle.
      if (index % 4 === 1 && prevRow !== row) {
        // For quadrant 2, column < center.column
        newImage.drawLine(
          { row, column: column + 1 },
          {
            row,
            column: center.column - (column - center.column + 1),
          },
          { strokeColor: fillColor, out: newImage },
        );
        prevRow = row;
        // Filling top half of the circle.
        newImage.drawLine(
          { row: center.row - (row - center.row), column: column + 1 },
          {
            row: center.row - (row - center.row),
            column: center.column - (column - center.column + 1),
          },
          { strokeColor: fillColor, out: newImage },
        );
      }

      index++;
    });
  }
  return newImage;
}
