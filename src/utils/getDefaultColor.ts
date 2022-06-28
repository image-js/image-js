import { IJS } from '../IJS';
import { Mask } from '../Mask';

import { ImageColorModel } from './constants/colorModels';

/**
 * Get the black colorfor a given color model.
 *
 * @param image - The used image.
 * @returns Black color.
 */
export function getDefaultColor(image: IJS | Mask): number[] {
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
      return [0];
    default:
      throw new Error(
        `image color model ${image.colorModel} is not compatible`,
      );
  }
}
