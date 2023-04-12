import { Image } from '../Image';
import { Mask } from '../Mask';

/**
 * Get the default color for a given color model.
 * The color is black for images and 1 for masks.
 *
 * @param image - The used image.
 * @returns Default color.
 */
export function getDefaultColor(image: Image | Mask): number[] {
  switch (image.colorModel) {
    case 'GREY':
      return [0];
    case 'GREYA':
      return [0, image.maxValue];
    case 'RGB':
      return [0, 0, 0];
    case 'RGBA':
      return [0, 0, 0, image.maxValue];
    case 'BINARY':
      return [1];
    default:
      throw new Error(
        `image color model ${image.colorModel} is not compatible`,
      );
  }
}
