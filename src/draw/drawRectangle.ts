import { Image } from '../Image';
import { Mask } from '../Mask';
import { Point } from '../utils/geometry/points';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage, maskToOutputMask } from '../utils/getOutputImage';
import checkProcessable from '../utils/validators/checkProcessable';

export interface DrawRectangleOptions<OutType> {
  /**
   * Origin of the rectangle relative to a parent image (top-left corner).
   * @default {row: 0, column: 0}
   */
  origin?: Point;
  /**
   * Specify the width of the rectangle.
   * @default image.width
   */
  width?: number;
  /**
   * Specify the width of the rectangle.
   * @default image.height
   */
  height?: number;
  /**
   * Color of the rectangle's border. Should be an array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   * @default black
   */
  strokeColor?: number[] | 'none';
  /**
   * Rectangle fill color array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   */
  fillColor?: number[] | 'none';
  /**
   * Image to which the resulting image has to be put.
   */
  out?: OutType;
}

export function drawRectangle(
  image: Image,
  options?: DrawRectangleOptions<Image>,
): Image;
export function drawRectangle(
  image: Mask,
  options?: DrawRectangleOptions<Mask>,
): Mask;
/**
 * Draw a rectangle defined by position of the top-left corner, width and height.
 * @param image - Image to process.
 * @param options - Draw rectangle options.
 * @returns The image with the rectangle drawing.
 */
export function drawRectangle(
  image: Image | Mask,
  options: DrawRectangleOptions<Mask | Image> = {},
): Image | Mask {
  const {
    origin = { column: 0, row: 0 },
    width = image.width,
    height = image.height,
    strokeColor = getDefaultColor(image),
    fillColor = 'none',
  } = options;
  const { column, row } = origin;

  let newImage: Image | Mask;
  if (image instanceof Image) {
    checkProcessable(image, {
      bitDepth: [8, 16],
    });
    newImage = getOutputImage(image, options, { clone: true });
  } else {
    newImage = maskToOutputMask(image, options, { clone: true });
  }

  if (strokeColor !== 'none') {
    for (
      let currentColumn = column;
      currentColumn < column + width;
      currentColumn++
    ) {
      newImage.setVisiblePixel(currentColumn, row, strokeColor);
      newImage.setVisiblePixel(currentColumn, row + height - 1, strokeColor);
    }
    for (
      let currentRow = row + 1;
      currentRow < row + height - 1;
      currentRow++
    ) {
      newImage.setVisiblePixel(column, currentRow, strokeColor);
      newImage.setVisiblePixel(column + width - 1, currentRow, strokeColor);
    }
  }
  if (fillColor !== 'none') {
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
        newImage.setVisiblePixel(currentColumn, currentRow, fillColor);
        newImage.setVisiblePixel(currentColumn, currentRow, fillColor);
      }
    }
  }
  return newImage;
}
