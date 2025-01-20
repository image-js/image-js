import type { Image } from '../Image.js';
import type { Mask } from '../Mask.js';
import type { Point } from '../utils/geometry/points.js';
import { getDefaultColor } from '../utils/getDefaultColor.js';
import { getOutputImage } from '../utils/getOutputImage.js';
import { setBlendedPixel } from '../utils/setBlendedPixel.js';
import { checkPointIsInteger } from '../utils/validators/checkPointIsInteger.js';

export interface PaintMaskOnImageOptions {
  /**
   * Top-left corner of the mask relative to a parent image.
   * @default `{row: 0, column: 0}`
   */
  origin?: Point;
  /**
   * Color with which to blend the image pixel.
   * @default Opaque black.
   */
  color?: Array<number | null>;
  /**
   * Whether the given color should be blended with the original pixel.
   * @default `true`
   */
  blend?: boolean;
  /**
   * Image to which to output.
   */
  out?: Image;
}

/**
 * Paint a mask onto an image and the given position and with the given color.
 * @param image - Image on which to paint the mask.
 * @param mask - Mask to paint on the image.
 * @param options - Paint mask options.
 * @returns The painted image.
 */
export function paintMaskOnImage(
  image: Image,
  mask: Mask,
  options: PaintMaskOnImageOptions = {},
): Image {
  const {
    origin = { row: 0, column: 0 },
    color = getDefaultColor(image),
    blend = true,
  } = options;
  const { column, row } = origin;

  if (color.length !== image.channels) {
    throw new RangeError('the given color is not compatible with the image');
  }

  checkPointIsInteger(origin, 'Origin');

  const result = getOutputImage(image, options, { clone: true });
  if (blend) {
    checkColorIsNumberArray(color);

    for (
      let currentRow = Math.max(row, 0);
      currentRow < Math.min(mask.height + row, image.height);
      currentRow++
    ) {
      for (
        let currentColumn = Math.max(column, 0);
        currentColumn < Math.min(mask.width + column, image.width);
        currentColumn++
      ) {
        if (mask.getBit(currentColumn - column, currentRow - row)) {
          setBlendedPixel(result, currentColumn, currentRow, color);
        }
      }
    }
  } else {
    for (
      let currentRow = Math.max(row, 0);
      currentRow < Math.min(mask.height + row, image.height);
      currentRow++
    ) {
      for (
        let currentColumn = Math.max(column, 0);
        currentColumn < Math.min(mask.width + column, image.width);
        currentColumn++
      ) {
        if (mask.getBit(currentColumn - column, currentRow - row)) {
          for (let channel = 0; channel < image.channels; channel++) {
            const currentValue = color[channel];
            if (typeof currentValue === 'number') {
              result.setValue(currentColumn, currentRow, channel, currentValue);
            }
          }
        }
      }
    }
  }

  return result;
}

function checkColorIsNumberArray(
  color: Array<number | null>,
): asserts color is number[] {
  for (const channel of color) {
    if (typeof channel !== 'number') {
      throw new TypeError(
        'cannot have null channels in color if blend is true',
      );
    }
  }
}
