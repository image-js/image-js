import { line } from 'bresenham-zingl';

import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';
import { Point } from '../utils/geometry/points';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';

export interface DrawLineOnIjsOptions {
  /**
   * Color of the line. Should be an array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default 'black'
   */
  strokeColor?: number[];
  /**
   * Image to which the resulting image has to be put.
   */
  out?: IJS;
}

/**
 * Draw a line defined by two points onto an image.
 *
 * @param image - Image to process.
 * @param from - Line starting point.
 * @param to - Line ending point.
 * @param options - Draw Line options.
 * @returns The mask with the line drawing.
 */
export function drawLineOnIjs(
  image: IJS,
  from: Point,
  to: Point,
  options: DrawLineOnIjsOptions = {},
): IJS {
  const newImage = getOutputImage(image, options, { clone: true });
  const { strokeColor: color = getDefaultColor(newImage) } = options;

  checkProcessable(newImage, 'drawLine', {
    bitDepth: [8, 16],
  });

  const numberChannels = Math.min(newImage.channels, color.length);
  line(
    from.column,
    from.row,
    to.column,
    to.row,
    (column: number, row: number) => {
      for (let channel = 0; channel < numberChannels; channel++) {
        newImage.setValue(column, row, channel, color[channel]);
      }
    },
  );
  return newImage;
}
