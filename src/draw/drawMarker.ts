import { Image } from '../Image';
import { Point } from '../geometry';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';
import checkProcessable from '../utils/validators/checkProcessable';
import { validateColor } from '../utils/validators/validators';

export interface DrawMarkerOptions {
  /**
   * Marker size, Odd number greater than 1.
   * @default 1
   */
  size?: number;
  /**
   * Marker shape.
   * @default 'cross'
   */
  shape?: 'circle' | 'triangle' | 'cross' | 'square';
  /**
   * Set marker as filled.
   * @default false
   */
  filled?: boolean;
  /**
   * Circle border color array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   * @default black
   */
  color?: number[];
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
    color = getDefaultColor(newImage),
    filled = false,
    shape = 'cross',
    size = 1,
  } = options;

  validateColor(color, newImage);
  checkProcessable(newImage, {
    bitDepth: [8, 16],
  });
  if (shape === 'circle') {
    newImage.drawCircle(point, size, {
      color,
      fill: filled ? color : undefined,
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
      strokeColor: color,
      fillColor: filled ? color : undefined,
      out: newImage,
    });
  }
  if (shape === 'cross') {
    newImage.drawLine(
      { row: point.row - size, column: point.column },
      { row: point.row + size, column: point.column },
      { strokeColor: color, out: newImage },
    );
    newImage.drawLine(
      { row: point.row, column: point.column - size },
      { row: point.row, column: point.column + size },
      { strokeColor: color, out: newImage },
    );
  }
  if (shape === 'square') {
    const origin = {
      row: Math.floor(point.row - size / 2),
      column: Math.floor(point.column - size / 2),
    };
    newImage.drawRectangle({
      origin,
      width: size,
      height: size,
      strokeColor: color,
      fillColor: filled ? color : undefined,
      out: newImage,
    });
  }
  return newImage;
}
