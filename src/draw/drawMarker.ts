import type { Image } from '../Image.js';
import type { Point } from '../geometry/index.js';
import { getDefaultColor } from '../utils/getDefaultColor.js';
import { getOutputImage } from '../utils/getOutputImage.js';
import checkProcessable from '../utils/validators/checkProcessable.js';
import { validateColor } from '../utils/validators/validators.js';

export interface DrawMarkerOptions {
  /**
   * Marker size, Odd number greater than 1.
   * @default `1`
   */
  size?: number;
  /**
   * Marker shape.
   * @default `'cross'`
   */
  shape?: 'circle' | 'triangle' | 'cross' | 'square';
  /**
   * Circle border color - An array of numerical values, one for each channel of the image. If less values are defined than there are channels in the image, the remaining channels will be set to 0.
   */
  fillColor?: number[];
  /**
   * Circle border color - An array of numerical values, one for each channel of the image. If less values are defined than there are channels in the image, the remaining channels will be set to 0.
   * @default A black pixel.
   */
  strokeColor?: number[];
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Image;
}

/**
 * Draw a marker on the image.
 * @param image - Image to process.
 * @param point - Marker center point.
 * @param options - Draw marker options.
 * @returns The image with the marker drawing.
 */
export function drawMarker(
  image: Image,
  point: Point,
  options: DrawMarkerOptions,
): Image {
  const newImage = getOutputImage(image, options, { clone: true });
  const {
    strokeColor = getDefaultColor(newImage),
    fillColor,
    shape = 'cross',
    size: markerSize = 1,
  } = options;
  const size = Math.round(markerSize);
  validateColor(strokeColor, newImage);
  if (fillColor) {
    validateColor(fillColor, newImage);
  }

  checkProcessable(newImage, {
    bitDepth: [8, 16],
  });
  if (shape === 'circle') {
    newImage.drawCircle(point, size, {
      strokeColor,
      fillColor,
      out: newImage,
    });
  }
  if (shape === 'triangle') {
    const points = [
      { row: point.row - size, column: point.column },
      { row: point.row, column: point.column + size },
      { row: point.row, column: point.column - size },
    ];
    newImage.drawPolygon(points, {
      strokeColor,
      fillColor,
      out: newImage,
    });
  }
  if (shape === 'cross') {
    newImage.drawLine(
      { row: point.row - size, column: point.column },
      { row: point.row + size, column: point.column },
      { strokeColor, out: newImage },
    );
    newImage.drawLine(
      { row: point.row, column: point.column - size },
      { row: point.row, column: point.column + size },
      { strokeColor, out: newImage },
    );
  }
  if (shape === 'square') {
    const origin = {
      row: point.row - (size - 1) / 2,
      column: point.column - (size - 1) / 2,
    };
    newImage.drawRectangle({
      origin,
      width: size,
      height: size,
      strokeColor,
      fillColor,
      out: newImage,
    });
  }
  return newImage;
}
