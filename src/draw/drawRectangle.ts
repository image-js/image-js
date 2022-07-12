import { IJS } from '../IJS';
import { Mask } from '../Mask';
import checkProcessable from '../utils/checkProcessable';
import { Point } from '../utils/geometry/points';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage, maskToOutputMask } from '../utils/getOutputImage';

export interface DrawRectangleOptions<OutType> {
  /**
   * Origin of the rectangle relative to a the parent image (top-left corner).
   *
   * @default {row: 0, column: 0}
   */
  origin?: Point;
  /**
   * Specify the width of the rectangle.
   *
   * @default image.width
   */
  width?: number;
  /**
   * Specify the width of the rectangle
   *
   * @default image.height
   */
  height?: number;
  /**
   * Color of the rectangle's border. Should be an array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default black
   */
  strokeColor?: number[] | 'none';
  /**
   * Rectangle fill color array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   */
  fillColor?: number[];
  /**
   * Image to which the resulting image has to be put.
   */
  out?: OutType;
}

export function drawRectangle(
  image: IJS,
  options?: DrawRectangleOptions<IJS>,
): IJS;
export function drawRectangle(
  image: Mask,
  options?: DrawRectangleOptions<Mask>,
): Mask;
/**
 * Draw a rectangle defined by position of the top-left corner, width and height.
 *
 * @param image - Image to process.
 * @param options - Draw rectangle options.
 * @returns The image with the rectangle drawing.
 */
export function drawRectangle(
  image: IJS | Mask,
  options: DrawRectangleOptions<Mask | IJS> = {},
): IJS | Mask {
  const {
    origin = { column: 0, row: 0 },
    width = image.width,
    height = image.height,
    strokeColor: color = getDefaultColor(image),
    fillColor: fill,
  } = options;
  const { column, row } = origin;

  let newImage: IJS | Mask;
  if (image instanceof IJS) {
    checkProcessable(image, 'drawRectangle', {
      bitDepth: [8, 16],
    });
    newImage = getOutputImage(image, options, { clone: true });
  } else {
    newImage = maskToOutputMask(image, options, { clone: true });
  }

  if (color !== 'none') {
    for (
      let currentColumn = column;
      currentColumn < column + width;
      currentColumn++
    ) {
      newImage.setPixel(currentColumn, row, color);
      newImage.setPixel(currentColumn, row + height - 1, color);
    }
    for (
      let currentRow = row + 1;
      currentRow < row + height - 1;
      currentRow++
    ) {
      newImage.setPixel(column, currentRow, color);
      newImage.setPixel(column + width - 1, currentRow, color);

      if (fill) {
        for (let col = column + 1; col < column + width - 1; col++) {
          newImage.setPixel(col, currentRow, fill);
          newImage.setPixel(col, currentRow, fill);
        }
      }
    }
  }
  // color is none but fill is defined
  else if (fill) {
    for (
      let currentRow = row + 1;
      currentRow < row + height - 1;
      currentRow++
    ) {
      for (
        let currentColumn = column + 1;
        currentColumn < column + width - 1;
        currentColumn++
      ) {
        newImage.setPixel(currentColumn, currentRow, fill);
        newImage.setPixel(currentColumn, currentRow, fill);
      }
    }
  }
  return newImage;
}
