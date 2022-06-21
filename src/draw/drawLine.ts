import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';

export interface Point {
  /**
   * point row
   *
   */
  row: number;
  /**
   * point column
   *
   */
  column: number;
}
export interface DrawLineOptions {
  /**
   * Array of N elements (e.g. R, G, B or G, A), N being the number of channels.
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
 * Draw a line defined by an array of points.
 *
 * @param image - Image to process.
 * @param from - Line starting point.
 * @param to - Line ending point.
 * @param options - Draw Line options.
 * @returns The original drew image
 */
export function drawLine(
  image: IJS,
  from: Point,
  to: Point,
  options: DrawLineOptions = {},
) {
  const newImage = getOutputImage(image, options, { clone: true });
  const { color = getDefaultColor(newImage) } = options;

  checkProcessable(newImage, 'drawPoints', {
    bitDepth: [8, 16],
  });

  const numberChannels = Math.min(newImage.channels, color.length);

  const dRow = to.row - from.row;
  const dColumn = to.column - from.column;
  const steps = Math.max(Math.abs(dRow), Math.abs(dColumn));

  const rowIncrement = dRow / steps;
  const columnIncrement = dColumn / steps;

  let { row, column } = from;

  for (let step = 0; step <= steps; step++) {
    const rowPoint = Math.round(row);
    const columnPoint = Math.round(column);
    if (
      rowPoint >= 0 &&
      columnPoint >= 0 &&
      rowPoint < newImage.height &&
      columnPoint < newImage.width
    ) {
      for (let channel = 0; channel < numberChannels; channel++) {
        newImage.setValue(columnPoint, rowPoint, channel, color[channel]);
      }
    }

    row = row + rowIncrement;
    column = column + columnIncrement;
  }

  return newImage;
}
