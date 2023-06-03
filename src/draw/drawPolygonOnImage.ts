import robustPointInPolygon from 'robust-point-in-polygon';

import { Image } from '../Image';
import { arrayPointsToObjects } from '../utils/arrayPointsToObjects';
import checkProcessable from '../utils/checkProcessable';
import { Point } from '../utils/geometry/points';
import { getOutputImage } from '../utils/getOutputImage';
import { validateColor } from '../utils/validators';

import { DrawPolylineOnImageOptions } from './drawPolylineOnImage';
import { deleteDuplicates } from './utils/deleteDuplicates';

export interface DrawPolygonOnImageOptions extends DrawPolylineOnImageOptions {
  /**
   * Fill color - array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   * @default 'black'
   */
  fillColor?: number[];
  /**
   * Origin of the rectangle relative to a parent image (top-left corner).
   * @default {row: 0, column: 0}
   */
  origin?: Point;
}
/**
 * Draw a polygon defined by an array of points onto an image.
 * @param image - Image to process.
 * @param points - Polygon vertices.
 * @param options - Draw Line options.
 * @returns The image with the polygon drawing.
 */
export function drawPolygonOnImage(
  image: Image,
  points: Point[],
  options: DrawPolygonOnImageOptions = {},
): Image {
  const {
    fillColor,
    origin = { column: 0, row: 0 },
    ...otherOptions
  } = options;

  checkProcessable(image, {
    bitDepth: [8, 16],
  });

  let newImage = getOutputImage(image, options, { clone: true });

  if (fillColor === undefined) {
    return newImage.drawPolyline([...points, points[0]], {
      origin,
      ...otherOptions,
    });
  } else {
    validateColor(fillColor, newImage);

    const filteredPoints = deleteDuplicates(points);

    const arrayPoints = arrayPointsToObjects(filteredPoints);

    for (let row = 0; row < newImage.height; row++) {
      for (let column = 0; column < newImage.width; column++) {
        if (robustPointInPolygon(arrayPoints, [column, row]) === -1) {
          newImage.setPixel(
            origin.column + column,
            origin.row + row,
            fillColor,
          );
        }
      }
    }
  }

  return newImage.drawPolyline([...points, points[0]], {
    origin,
    ...otherOptions,
  });
}
