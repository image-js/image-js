import { Image } from '../Image';
import { Mask } from '../Mask';

import { ImageColorModel } from './constants/colorModels';

/**
 * Get the default color for a given color model.
 * The color is black for images and 1 for masks.
 *
 * @param image - The used image.
 * @returns Default color.
 */
export function getDefaultColor(image: Image | Mask): number[] {
  switch (image.colorModel) {
    case ImageColorModel.GREY:
      return [0];
    case ImageColorModel.GREYA:
      return [0, image.maxValue];
    case ImageColorModel.RGB:
      return [0, 0, 0];
    case ImageColorModel.RGBA:
      return [0, 0, 0, image.maxValue];
    case ImageColorModel.BINARY:
      return [1];
    default:
      throw new Error(
        `image color model ${image.colorModel} is not compatible`,
      );
  }
}
