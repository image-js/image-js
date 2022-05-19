import { IJS } from '../IJS';

import { ImageColorModel } from './colorModels';

/**
 * Get black color in image color modal
 *
 * @param image - The used image
 * @returns Black color
 */
export function getDefaultColor(image: IJS): number[] {
  switch (image.colorModel) {
    case ImageColorModel.GREY:
      return [0];
    case ImageColorModel.GREYA:
      return [0, image.maxValue];
    case ImageColorModel.RGB:
      return [0, 0, 0];
    case ImageColorModel.RGBA:
      return [0, 0, 0, image.maxValue];
    default:
      throw new Error(
        `image color model ${image.colorModel} is not compatible`,
      );
  }
}
