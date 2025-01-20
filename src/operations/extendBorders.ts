import { Image } from '../Image.js';
import type { BorderType } from '../utils/interpolateBorder.js';
import { getBorderInterpolation } from '../utils/interpolateBorder.js';

export interface ExtendBordersOptions {
  /**
   * Left and right border thickness.
   */
  horizontal: number;
  /**
   *Top and bottom border thickness.
   */
  vertical: number;
  /**
   * Specify how the borders should be handled.
   * @default `'reflect101'`
   */
  borderType?: BorderType;
  /**
   * Value of the border if BorderType is 'constant'.
   * @default `0`
   */
  borderValue?: number;
}

/**
 * Extend the borders of an image according to the given border type.
 * @param image - Image to extend.
 * @param options - Options.
 * @returns A copy of the image with extended borders.
 */
export function extendBorders(
  image: Image,
  options: ExtendBordersOptions,
): Image {
  const {
    horizontal,
    vertical,
    borderType = 'reflect101',
    borderValue = 0,
  } = options;

  const interpolateBorder = getBorderInterpolation(borderType, borderValue);

  const newImage = Image.createFrom(image, {
    width: image.width + 2 * horizontal,
    height: image.height + 2 * vertical,
  });

  image.copyTo(newImage, {
    origin: {
      column: horizontal,
      row: vertical,
    },
    out: newImage,
  });

  // Top strip
  for (let row = 0; row < vertical; row++) {
    for (let col = 0; col < newImage.width; col++) {
      for (let channel = 0; channel < image.channels; channel++) {
        const newValue = interpolateBorder(
          col - horizontal,
          row - vertical,
          channel,
          image,
        );
        newImage.setValue(col, row, channel, newValue);
      }
    }
  }

  // Bottom strip
  for (let row = newImage.height - vertical; row < newImage.height; row++) {
    for (let col = 0; col < newImage.width; col++) {
      for (let channel = 0; channel < image.channels; channel++) {
        const newValue = interpolateBorder(
          col - horizontal,
          row - vertical,
          channel,
          image,
        );
        newImage.setValue(col, row, channel, newValue);
      }
    }
  }

  // Left strip
  for (let row = vertical; row < newImage.height - vertical; row++) {
    for (let col = 0; col < horizontal; col++) {
      for (let channel = 0; channel < image.channels; channel++) {
        const newValue = interpolateBorder(
          col - horizontal,
          row - vertical,
          channel,
          image,
        );
        newImage.setValue(col, row, channel, newValue);
      }
    }
  }

  // Right strip
  for (let row = vertical; row < newImage.height - vertical; row++) {
    for (let col = newImage.width - horizontal; col < newImage.width; col++) {
      for (let channel = 0; channel < image.channels; channel++) {
        const newValue = interpolateBorder(
          col - horizontal,
          row - vertical,
          channel,
          image,
        );
        newImage.setValue(col, row, channel, newValue);
      }
    }
  }

  return newImage;
}
