import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';
import { Point } from '../utils/types';

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
  const { row: cRow, column: cColumn } = center;
  checkProcessable(newImage, 'paintPoints', {
    bitDepth: [8, 16],
  });

  /**
   *
   * Draw all other 7 pixels
   * Present at symmetric position
   *
   * @param column - Position column.
   * @param row - Position row.
   */
  function drawCircle(column: number, row: number) {
    newImage.setPixel(column + cColumn, row + cRow, color);
    newImage.setPixel(row + cColumn, column + cRow, color);
    newImage.setPixel(-row + cColumn, column + cRow, color);
    newImage.setPixel(column + cColumn, -row + cRow, color);
    // if (column !== 0) {
    newImage.setPixel(-column + cColumn, row + cRow, color);
    newImage.setPixel(row + cColumn, -column + cRow, color);
    newImage.setPixel(-row + cColumn, -column + cRow, color);
    newImage.setPixel(-column + cColumn, -row + cRow, color);
    // }
    if (fill) {
      fillCircle(column, row);
    }
  }

  /**
   *
   * Fill circle symmetrically
   *
   * @param column - Point column.
   * @param row - Point row.
   */
  function fillCircle(column: number, row: number) {
    if (fill) {
      for (let i = column; i < row; i++) {
        newImage.setPixel(column + cColumn, i + cRow, fill);
        newImage.setPixel(column + cColumn, -i + cRow, fill);
        newImage.setPixel(i + cColumn, column + cRow, fill);
        newImage.setPixel(-i + cColumn, column + cRow, fill);
        // if (column !== 0) {
        newImage.setPixel(-column + cColumn, i + cRow, fill);
        newImage.setPixel(-column + cColumn, -i + cRow, fill);
        newImage.setPixel(i + cColumn, -column + cRow, fill);
        newImage.setPixel(-i + cColumn, -column + cRow, fill);
        // }
      }
    }
  }
  let column = 0;
  let row = radius;
  let d = 3 - 2 * radius;
  drawCircle(column, row);
  while (row >= column) {
    column++;
    if (d > 0) {
      row--;
      d = d + 4 * (column - row) + 10;
    } else {
      d = d + 4 * column + 6;
    }
    drawCircle(column, row);
  }

  return newImage;
}
