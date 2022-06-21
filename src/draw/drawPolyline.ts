import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';

import { Point } from './drawLine';

export interface DrawPolylineOptions {
  /**
   * lines color - array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default black
   */
  color?: number[];
  /**
   * Image to which the resulting image has to be put.
   */
  out?: IJS;
}
/**
 * Draw a polyline defined by an array of points.
 *
 * @param image - Image to process.
 * @param points - Polyline array of points.
 * @param options - Draw polyline options.
 * @returns The original drew image
 */
export function drawPolyline(
  image: IJS,
  points: Point[],
  options: DrawPolylineOptions = {},
) {
  let newImage = getOutputImage(image, options, { clone: true });

  const { color = getDefaultColor(image) } = options;
  checkProcessable(newImage, 'drawPolyline', {
    bitDepth: [8, 16],
  });

  const numberChannels = Math.min(newImage.channels, color.length);
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];

    const dColumn = to.column - from.column;
    const dRow = to.row - from.row;
    const steps = Math.max(Math.abs(dColumn), Math.abs(dRow));

    const columnIncrement = dColumn / steps;
    const rowIncrement = dRow / steps;

    let { row, column } = from;

    for (let step = 0; step <= steps; step++) {
      const rowPoint = Math.round(row);
      const columnPoint = Math.round(column);
      if (
        columnPoint >= 0 &&
        rowPoint >= 0 &&
        columnPoint < newImage.width &&
        rowPoint < newImage.height
      ) {
        for (let channel = 0; channel < numberChannels; channel++) {
          newImage.setValue(columnPoint, rowPoint, channel, color[channel]);
        }
      }

      row = row + rowIncrement;
      column = column + columnIncrement;
    }
  }
  return newImage;
}
