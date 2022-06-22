import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';

import { Point } from './drawLineOnMask';
import { DrawPolylineOnIjsOptions } from './drawPolylineOnIjs';
import { deleteDouble } from './utils/deleteDouble';
import { isAtTheRightOfTheLine, lineBetweenTwoPoints } from './utils/lineUtils';

export interface DrawPolygonOptions extends DrawPolylineOnIjsOptions {
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
export function drawPolygon(
  image: IJS,
  points: Point[],
  options: DrawPolygonOptions = {},
) {
  const {
    fill = getDefaultColor(image),
    filled = false,
    ...otherOptions
  } = options;

  let newImage = getOutputImage(image, options, { clone: true });
  checkProcessable(newImage, 'drawPolygon', {
    bitDepth: [8, 16],
  });
  const filteredPoints = deleteDouble(points);
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
