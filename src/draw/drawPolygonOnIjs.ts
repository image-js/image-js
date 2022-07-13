import robustPointInPolygon from 'robust-point-in-polygon';

import { IJS } from '../IJS';
import { arrayPointsToObjects } from '../utils/arrayPointsToObjects';
import checkProcessable from '../utils/checkProcessable';
import { Point } from '../utils/geometry/points';
import { getOutputImage } from '../utils/getOutputImage';

import { DrawPolylineOnIjsOptions } from './drawPolylineOnIjs';
import { deleteDuplicates } from './utils/deleteDuplicates';

export interface DrawPolygonOnIjsOptions extends DrawPolylineOnIjsOptions {
  /**
   * Fill color - array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default 'black'
   */
  fillColor?: number[];
  /**
   * Origin of the rectangle relative to a parent image (top-left corner).
   *
   * @default {row: 0, column: 0}
   */
  origin?: Point;
}
/**
 * Draw a polygon defined by an array of points onto an image.
 *
 * @param image - Image to process.
 * @param points - Polygon vertices.
 * @param options - Draw Line options.
 * @returns The image with the polygon drawing.
 */
export function drawPolygonOnIjs(
  image: IJS,
  points: Point[],
  options: DrawPolygonOnIjsOptions = {},
): IJS {
  const {
    fillColor,
    origin = { column: 0, row: 0 },
    ...otherOptions
  } = options;

  checkProcessable(image, 'drawPolygon', {
    bitDepth: [8, 16],
  });

  let newImage = getOutputImage(image, options, { clone: true });

  if (fillColor === undefined) {
    return newImage.drawPolyline([...points, points[0]], {
      origin,
      ...otherOptions,
    });
  } else {
    if (fillColor.length !== image.channels) {
      throw new Error('drawPolygon: fill color is not compatible with image.');
    }

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
