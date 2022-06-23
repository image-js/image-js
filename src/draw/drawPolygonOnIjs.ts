import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';

import { Point } from './drawLineOnMask';
import { DrawPolylineOnIjsOptions } from './drawPolylineOnIjs';
import { deleteDuplicates } from './utils/deleteDuplicates';
import { isAtTheRightOfTheLine, lineBetweenTwoPoints } from './utils/lineUtils';

export interface DrawPolygonOnIjsOptions extends DrawPolylineOnIjsOptions {
  /**
   * Fill color - array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default 'black'
   */
  fill?: number[];
  /**
   * Fill polygon.
   */
  filled?: boolean;
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
    fill = getDefaultColor(image),
    filled = false,
    ...otherOptions
  } = options;

  if (fill.length !== image.channels) {
    throw new Error('drawPolygon: fill color is not compatible with image.');
  }

  checkProcessable(image, 'drawPolygon', {
    bitDepth: [8, 16],
  });

  let newImage = getOutputImage(image, options, { clone: true });

  if (filled === false) {
    return newImage.drawPolyline([...points, points[0]], otherOptions);
  } else {
    let matrixBinary: number[][] = [];
    for (let i = 0; i < newImage.height; i++) {
      matrixBinary[i] = [];
      for (let j = 0; j < newImage.width; j++) {
        matrixBinary[i].push(0);
      }
    }
    const filteredPoints = deleteDuplicates(points);
    for (let i = 0; i < filteredPoints.length; i++) {
      const line = lineBetweenTwoPoints(
        filteredPoints[i],
        filteredPoints[(i + 1) % filteredPoints.length],
      );
      for (let row = 0; row < newImage.height; row++) {
        for (let column = 0; column < newImage.width; column++) {
          if (isAtTheRightOfTheLine({ column, row }, line, newImage.height)) {
            matrixBinary[row][column] = matrixBinary[row][column] === 0 ? 1 : 0;
          }
        }
      }
    }
    for (let row = 0; row < newImage.height; row++) {
      for (let column = 0; column < newImage.width; column++) {
        if (matrixBinary[row][column] === 1) {
          let numberChannels = Math.min(newImage.channels, fill.length);
          for (let channel = 0; channel < numberChannels; channel++) {
            newImage.setValue(column, row, channel, fill[channel]);
          }
        }
      }
    }
    return newImage.drawPolyline([...points, points[0]], otherOptions);
  }
}
