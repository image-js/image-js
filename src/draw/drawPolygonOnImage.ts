import robustPointInPolygon from 'robust-point-in-polygon';

import type { Image } from '../Image.js';
import { arrayPointsToObjects } from '../utils/arrayPointsToObjects.js';
import type { Point } from '../utils/geometry/points.js';
import { getOutputImage } from '../utils/getOutputImage.js';
import { setBlendedVisiblePixel } from '../utils/setBlendedVisiblePixel.js';
import checkProcessable from '../utils/validators/checkProcessable.js';
import { validateColor } from '../utils/validators/validators.js';

import type { DrawPolylineOnImageOptions } from './drawPolylineOnImage.js';
import { deleteDuplicates } from './utils/deleteDuplicates.js';

export interface DrawPolygonOnImageOptions extends DrawPolylineOnImageOptions {
  /**
   * Fill color - An array of numerical values, one for each channel of the image. If less values are defined than there are channels in the image, the remaining channels will be set to 0.
   * @default A black pixel.
   */
  fillColor?: number[];
  /**
   * Origin of the rectangle relative to a parent image (top-left corner).
   * @default `{row: 0, column: 0}`
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

  const newImage = getOutputImage(image, options, { clone: true });

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
          setBlendedVisiblePixel(
            newImage,
            Math.round(origin.column) + column,
            Math.round(origin.row) + row,
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
