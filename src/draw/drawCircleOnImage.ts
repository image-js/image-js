import { circle } from 'bresenham-zingl';

import { Image } from '../Image';
import { Point } from '../utils/geometry/points';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';
import { setBlendedVisiblePixel } from '../utils/setBlendedVisiblePixel';
import checkProcessable from '../utils/validators/checkProcessable';
import { validateColor } from '../utils/validators/validators';

import { roundPoint } from './utils/roundPoint';

// Inspired by https://www.geeksforgeeks.org/bresenhams-circle-drawing-algorithm/

export interface DrawCircleOnImageOptions {
  /**
   * Circle border color array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   * @default A black pixel.
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
  const { color = getDefaultColor(newImage), fill } = options;

  validateColor(color, newImage);

  checkProcessable(newImage, {
    bitDepth: [8, 16],
  });

  if (radius < 0) {
    throw new RangeError('circle radius must be positive');
  }

  center = roundPoint(center);
  radius = Math.round(radius);

  if (radius === 0) {
    setBlendedVisiblePixel(newImage, center.column, center.row, color);
    return newImage;
  }

  if (!fill) {
    circle(center.column, center.row, radius, (column: number, row: number) => {
      setBlendedVisiblePixel(newImage, column, row, color);
    });
  } else {
    if (radius === 1) {
      setBlendedVisiblePixel(newImage, center.column, center.row, fill);
    }
    circle(center.column, center.row, radius, (column: number, row: number) => {
      setBlendedVisiblePixel(newImage, column, row, color);

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
