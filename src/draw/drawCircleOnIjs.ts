import { circle } from 'bresenham-zingl';

import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';
import { Point } from '../utils/geometry/points';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';

// Inspired by https://www.geeksforgeeks.org/bresenhams-circle-drawing-algorithm/

export interface DrawCircleOnIjsOptions {
  /**
   * Circle border color array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default black
   */
  color?: number[];
  /**
   * Circle fill color array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   */
  fill?: number[];

  /**
   * Image to which the resulting image has to be put.
   */
  out?: IJS;
}

/**
 *
 * Draw a circle defined by center and radius.
 *
 * @param image - Image to process.
 * @param center - Circle center point.
 * @param radius - Circle radius.
 * @param options - Draw circle options.
 * @returns The original drawn image
 */
export function drawCircleOnIjs(
  image: IJS,
  center: Point,
  radius: number,
  options: DrawCircleOnIjsOptions = {},
): IJS {
  const newImage = getOutputImage(image, options, { clone: true });
  const { color = getDefaultColor(newImage), fill } = options;
  checkProcessable(newImage, 'paintPoints', {
    bitDepth: [8, 16],
  });

  if (radius < 0) {
    throw new Error('Circle radius must be positive');
  }
  if (radius === 0) {
    newImage.setVisiblePixel(center.column, center.row, color);
    return newImage;
  }

  if (!fill) {
    circle(center.column, center.row, radius, (column: number, row: number) => {
      newImage.setVisiblePixel(column, row, color);
    });
  } else {
    if (radius === 1) {
      newImage.setVisiblePixel(center.column, center.row, fill);
    }
    circle(center.column, center.row, radius, (column: number, row: number) => {
      newImage.setVisiblePixel(column, row, color);

      //todo: fill is not optimal we can fill symmetrically
      if (column - 1 > center.column) {
        newImage.drawLine(
          { row, column: column - 1 },
          { row, column: center.column },
          { strokeColor: fill, out: newImage },
        );
      } else if (column + 1 < center.column) {
        newImage.drawLine(
          { row, column: column + 1 },
          { row, column: center.column },
          { strokeColor: fill, out: newImage },
        );
      }
    });
  }

  return newImage;
}
