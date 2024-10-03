import { Image } from '../Image';
import { Mask } from '../Mask';
import { Point } from '../utils/geometry/points';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage, maskToOutputMask } from '../utils/getOutputImage';
import { setBlendedVisiblePixel } from '../utils/setBlendedVisiblePixel';
import checkProcessable from '../utils/validators/checkProcessable';

export interface DrawRectangleOptions<OutType> {
  /**
   * Origin of the rectangle relative to a parent image (top-left corner).
   * @default `{row: 0, column: 0}`
   */
  origin?: Point;
  /**
   * Specify the width of the rectangle.
   * @default `image.width`
   */
  width?: number;
  /**
   * Specify the width of the rectangle.
   * @default `image.height`
   */
  height?: number;
  /**
   * Color of the rectangle's border. Should be an array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   * @default A black pixel.
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
    width: rectangleWidth = image.width,
    height: rectangleHeight = image.height,
    origin = { column: 0, row: 0 },
    strokeColor = getDefaultColor(image),
    fillColor = 'none',
  } = options;
  const width = Math.round(rectangleWidth);
  const height = Math.round(rectangleHeight);
  const column = Math.round(origin.column);
  const row = Math.round(origin.row);
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
      setBlendedVisiblePixel(newImage, currentColumn, row, strokeColor);
      setBlendedVisiblePixel(
        newImage,
        currentColumn,
        row + height - 1,
        strokeColor,
      );
    }
    for (
      let currentRow = row + 1;
      currentRow < row + height - 1;
      currentRow++
    ) {
      setBlendedVisiblePixel(newImage, column, currentRow, strokeColor);
      setBlendedVisiblePixel(
        newImage,
        column + width - 1,
        currentRow,
        strokeColor,
      );
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
        setBlendedVisiblePixel(newImage, currentColumn, currentRow, fillColor);
      }
    }
  }
  return newImage;
}
