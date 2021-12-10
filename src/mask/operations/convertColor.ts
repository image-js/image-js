import { ImageColorModel } from '../..';
import { IJS } from '../../IJS';
import { Mask } from '../Mask';

/**
 * Convert a mask to a given color model.
 *
 * @param mask - Mask to convert.
 * @param colorModel - New color model. Only GREY is accepted.
 * @returns The new image instance
 */
export function convertColor(mask: Mask, colorModel: ImageColorModel): IJS {
  if (colorModel !== ImageColorModel.GREY) {
    throw new Error(`Masks can only be converted to GREY images.`);
  }
  let img = new IJS(mask.width, mask.height, { colorModel });
  for (let i = 0; i < mask.size; i++) {
    img.setValueByIndex(i, 0, mask.getBitByIndex(i) ? img.maxValue : 0);
  }
  return img;
}
